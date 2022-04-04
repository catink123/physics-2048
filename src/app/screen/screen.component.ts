import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements AfterViewInit, OnDestroy {
  @Input() notMain = false;
  @ViewChild('screen') element?: ElementRef<HTMLDivElement>;
  screenElements?: NodeListOf<HTMLElement>;
  constructor() { }

  ngAfterViewInit(): void {
    this.screenElements = this.element!.nativeElement.querySelectorAll('button, input, select');
    this.element!.nativeElement.addEventListener("keydown", this.navigate);
  }

  navigate(e: any) {
    console.log(e);
    const numberKey = e.key.replace(/[1-9]/, "");
    if (numberKey.length !== 0)
      this.screenElements![numberKey - 1].click()
    console.log(numberKey);
  }

  ngOnDestroy(): void {
    this.element!.nativeElement.removeEventListener("keydown", this.navigate);
  }
}
