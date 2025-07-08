import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ticker-selector',
  templateUrl: './ticker-selector.component.html',
  styleUrls: ['./ticker-selector.component.scss']
})
export class TickerSelectorComponent {
  @Input() selectedTicker: string = 'BTC';
  @Output() tickerChange = new EventEmitter<string>();

  tickers = [
    { value: 'BTC', viewValue: 'Bitcoin (BTC)' },
    { value: 'ETH', viewValue: 'Ethereum (ETH)' },
    { value: 'AAPL', viewValue: 'Apple (AAPL)' },
    { value: 'MSFT', viewValue: 'Microsoft (MSFT)' },
    { value: 'GOOGL', viewValue: 'Google (GOOGL)' },
    { value: 'AMZN', viewValue: 'Amazon (AMZN)' }
  ];

  onSelectionChange(ticker: string): void {
    this.tickerChange.emit(ticker);
  }
}