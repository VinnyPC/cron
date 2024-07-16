import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  minute: string = '0';
  hour: string = '';
  dayOfMonth: string = '';
  month: string = '';
  dayOfWeek: string = '';
  cron: string = '';

  cronDescription: string = '';

  errorMessages: string[] = [];

  months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  weekdays = [
    'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
    'quinta-feira', 'sexta-feira', 'sábado'
  ];

  updateDescription() {
    this.errorMessages = [];
    let isValid = true;

    const hour = this.hour ? String(this.hour).padStart(2, '0') : '*';
    const minute = this.minute ? String(this.minute).padStart(2, '0') : '*';
    const dayOfMonth = this.dayOfMonth ? this.dayOfMonth : '*';
    const month = this.month ? this.month : '*';
    const dayOfWeek = this.dayOfWeek ? this.dayOfWeek : '*';
    const cronHour = this.hour ? this.hour : '*';
    const cronMinute = this.minute ? this.minute : '*';

    if (this.hour && (parseInt(this.hour, 10) < 0 || parseInt(this.hour, 10) > 23)) {
      this.errorMessages.push('Hora deve ser entre 0 e 23.');
      isValid = false;
    }
    if (this.dayOfMonth && (parseInt(this.dayOfMonth, 10) < 1 || parseInt(this.dayOfMonth, 10) > 30)) {
      this.errorMessages.push('Dia do mês deve ser entre 1 e 30.');
      isValid = false;
    }
    if (this.month && (parseInt(this.month, 10) < 1 || parseInt(this.month, 10) > 12)) {
      this.errorMessages.push('Mês deve ser entre 1 e 12.');
      isValid = false;
    }
    if (this.dayOfWeek && (parseInt(this.dayOfWeek, 10) < 0 || parseInt(this.dayOfWeek, 10) > 6)) {
      this.errorMessages.push('Dia da semana deve ser entre 0 e 6.');
      isValid = false;
    }

    if (isValid) {
      this.cron = `${cronMinute} ${cronHour} ${dayOfMonth} ${month} ${dayOfWeek}`;

      let description = '';
      if (this.hour) {
        description += `Às ${hour}:${minute}`;
      }
      if (this.dayOfMonth) {
        description += ` do dia ${this.dayOfMonth}`;
      }
      if (this.month) {
        const monthIndex = parseInt(this.month, 10) - 1;
        if (monthIndex >= 0 && monthIndex < this.months.length) {
          description += ` em ${this.months[monthIndex]}`;
        }
      }
      if (this.dayOfWeek || this.dayOfWeek === '0') {
        const dayIndex = parseInt(this.dayOfWeek, 10);
        if (dayIndex >= 0 && dayIndex < this.weekdays.length) {
          description += ` de ${this.weekdays[dayIndex]}`;
        }
      }

      this.cronDescription = description;
    } else {
      this.cronDescription = '';
      this.cron = '';
    }

    if(this.errorMessages.length > 0){
      console.log(this.errorMessages)
    }
    
    console.log(this.cron);
  }
}
