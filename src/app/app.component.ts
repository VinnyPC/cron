import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

export interface CronExpression {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgIf, NgFor],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cronExpression: string = '';
  description: string = '';
  nextExecutions: string[] = [];

  parseCronExpression(expression: string): CronExpression {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = expression.split(' ');
    return { minute, hour, dayOfMonth, month, dayOfWeek };
  }

  generateDescription(cron: CronExpression): string {
    const minuteDesc = this.getPartDescription(cron.minute, 'minute');
    const hourDesc = this.getPartDescription(cron.hour, 'hour');
    const dayOfMonthDesc = this.getPartDescription(cron.dayOfMonth, 'day of the month');
    const monthDesc = this.getPartDescription(cron.month, 'month');
    const dayOfWeekDesc = this.getPartDescription(cron.dayOfWeek, 'day of the week');

    return `At ${minuteDesc} past ${hourDesc}, ${dayOfMonthDesc}, ${monthDesc}, ${dayOfWeekDesc}.`;
  }

  getPartDescription(cronPart: string, unit: string): string {
    if (cronPart === '*') return `every ${unit}`;

    if (cronPart.includes('/')) {
      const [start, step] = cronPart.split('/');
      if (start === '*') {
        return `every ${step} ${unit}s`;
      }
      return `every ${step} ${unit}s starting at ${start}`;
    }

    if (cronPart.includes('-')) {
      const [start, end] = cronPart.split('-');
      return `from ${start} to ${end} ${unit}s`;
    }

    if (cronPart.includes(',')) {
      return `${unit}s ${cronPart.replace(/,/g, ', ')}`;
    }

    return `${unit} ${cronPart}`;
  }

  generateNextExecutions(expression: CronExpression, count: number = 5): string[] {
    const executions: string[] = [];
    let currentDate = new Date();
    let attempts = 0;  // Safeguard counter to prevent infinite loop

    while (executions.length < count && attempts < 10000) {
      attempts++;
      currentDate.setMinutes(currentDate.getMinutes() + 1);
      const matchesMinute = this.checkCronPart(currentDate.getMinutes(), expression.minute);
      const matchesHour = this.checkCronPart(currentDate.getHours(), expression.hour);
      const matchesDayOfMonth = this.checkCronPart(currentDate.getDate(), expression.dayOfMonth);
      const matchesMonth = this.checkCronPart(currentDate.getMonth() + 1, expression.month);
      const matchesDayOfWeek = this.checkCronPart(currentDate.getDay(), expression.dayOfWeek);

      if (matchesMinute && matchesHour && matchesDayOfMonth && matchesMonth && matchesDayOfWeek) {
        executions.push(currentDate.toString());
      }
    }

    return executions.length > 0 ? executions : ['No valid execution times found within reasonable attempts'];
  }

  checkCronPart(value: number, cronPart: string): boolean {
    if (cronPart === '*') return true;

    if (cronPart.includes('/')) {
      const [start, step] = cronPart.split('/');
      const stepValue = parseInt(step, 10);
      const startValue = start === '*' ? 0 : parseInt(start, 10);
      return value % stepValue === startValue % stepValue;
    }

    if (cronPart.includes('-')) {
      const [start, end] = cronPart.split('-');
      return value >= parseInt(start, 10) && value <= parseInt(end, 10);
    }

    if (cronPart.includes(',')) {
      return cronPart.split(',').map(Number).includes(value);
    }

    return value === parseInt(cronPart, 10);
  }

  onCronChange() {
    const cron = this.parseCronExpression(this.cronExpression);
    this.description = this.generateDescription(cron);
    this.nextExecutions = this.generateNextExecutions(cron);
  }
}
