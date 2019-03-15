import { Component, Input, OnInit } from '@angular/core';

import { environment } from 'app/../environments/environment';
import { CurrentUser } from 'app/core/models/current-user';
import { UserLocationData } from 'app/core/models/identity';

@Component({
  selector: 'app-interview-map',
  templateUrl: './interview-map.component.html',
  styleUrls: ['./interview-map.component.scss'],
})
export class InterviewMapComponent implements OnInit {
  public url: string;

  @Input() public you: CurrentUser;

  @Input() public counterpart: CurrentUser;

  constructor() {}

  public ngOnInit(): void {
    // shorten url for https://s3.amazonaws.com/crossover-images/icons/map-marker-blue.png
    const urlBlueMarker = 'http://goo.gl/bq7NMr';
    // shorten url for https://s3.amazonaws.com/crossover-images/icons/map-marker-gray.png
    const urlGrayMarker = 'http://goo.gl/0y19sB';

    this.url = 'https://maps.googleapis.com/maps/api/staticmap?' +
        'center=0,10&zoom=0&size=260x240&scale=2&format=png' +
        '&style=feature:administrative|visibility:off' +
        '&style=style=feature:water|color:0xffffff' +
        '&style=feature:landscape|visibility:on|color:0xe5f1f7' +
        '&key=' + environment.mapsKey +
        '&markers=scale:2|icon:' + urlGrayMarker + '|' +
        this.getText(this.you.location) +
        '&markers=scale:2|icon:' + urlBlueMarker + '|' +
        this.getText(this.counterpart.location);
  }

  public mapReady(): void {
  }

  private getText(location: UserLocationData): string {
    const UPPER_BOUND = -164.5;
    const LOWER_BOUND = -175.8;
    const CENTER = Math.abs((UPPER_BOUND - LOWER_BOUND) / 2);

    const latitude = location.latitude;
    let longitude = location.longitude;
    if (latitude && longitude) {
      if (longitude > LOWER_BOUND && longitude < UPPER_BOUND) {
        longitude =
          Math.abs(LOWER_BOUND - longitude) <= CENTER
            ? LOWER_BOUND
            : UPPER_BOUND;
      }
      return latitude + ',' + longitude;
    } else {
      return location.country && location.country.name ? location.country.name.replace(/['"]/g, '') : '';
    }
  }
}
