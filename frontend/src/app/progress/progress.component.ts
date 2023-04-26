import {Component, Input, OnInit} from '@angular/core';
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  @Input() maxTimerValue: number = 10;

  @Input() tick: Function | undefined;

  private MAX_TIMER_VALUE = 10; // in seconds
  private readonly REFRESH_INTERVAL = 10; // in milliseconds
  private readonly TIMER_TICK_VALUE = 0.01; // in seconds
  timerValue: number = this.MAX_TIMER_VALUE;
  private subscription: Subscription | undefined;

  constructor() { }

  ngOnInit(): void {
    this.MAX_TIMER_VALUE = this.maxTimerValue;
    this.timerValue = this.MAX_TIMER_VALUE;
    // Start the timer
    this.subscription = interval(this.REFRESH_INTERVAL).subscribe(() => {
      this.timerValue -= this.TIMER_TICK_VALUE;
      if (this.timerValue < 0) {
        this.timerValue = this.MAX_TIMER_VALUE;
        if (this.tick) {
          this.tick();
        } else {
          console.error('No tick function defined for timer');
        }
      }
    });
  }

  getProgressBarValue(): number {
    return Math.floor((this.timerValue / this.MAX_TIMER_VALUE) * 100);
  }

  getStatus(): string {
    const timerPercentage = this.getProgressBarValue();

    if (timerPercentage > 75) {
      return 'primary';
    } else if (timerPercentage > 40) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  getTimerValue(): string {
    // convert this.MAX_TIMER_VALUE to SS.sss format
    const seconds = Math.floor(this.timerValue);
    const milliseconds = Math.floor((this.timerValue - seconds) * 1000);
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const millisecondsString = milliseconds < 100 ? `0${milliseconds}` : `${milliseconds}`;
    return `${secondsString}.${millisecondsString.slice(0, -1)}`;
  }

  ngOnDestroy(): void {
    // unsubscribe from the timer
    this.subscription?.unsubscribe();
  }

}
