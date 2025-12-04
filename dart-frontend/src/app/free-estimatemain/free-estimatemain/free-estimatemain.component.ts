import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-free-estimatemain',
  templateUrl: './free-estimatemain.component.html',
  styleUrls: ['./free-estimatemain.component.css'],
})
export class FreeEstimatemainComponent implements OnInit {
  constructor(public util: UtilService) {}

  ngOnInit(): void {}
}
