import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active-devices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-devices.html',
  styleUrls: ['./active-devices.css']
})
export class ActiveDevicesComponent {
  devices = [
    { id: 1, browser: 'Firefox on OS X', device: 'Macintosh', ip: '86.27.186.110', lastAction: '14 hours ago', current: true },
    { id: 2, browser: 'Safari on OS X', device: 'Macintosh', ip: '36.27.186.42', lastAction: '23 hours ago', current: false },
    { id: 3, browser: 'Edge on Windows', device: 'Windows', ip: '193.30.116.5', lastAction: '1 day ago', current: false },
    { id: 4, browser: 'Chrome on Mac', device: 'Macintosh', ip: '86.27.186.110', lastAction: '1 month ago', current: false }
  ];

  logoutDevice(id: number) {
    console.log('Logging out device', id);
    this.devices = this.devices.filter(d => d.id !== id);
  }

  logoutAllOthers() {
    console.log('Logging out all other devices');
    this.devices = this.devices.filter(d => d.current);
  }
}

