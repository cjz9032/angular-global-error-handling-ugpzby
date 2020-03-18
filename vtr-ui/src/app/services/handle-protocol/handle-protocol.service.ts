import { Injectable, Injector } from '@angular/core';
import { URL } from 'url';
import { Router } from '@angular/router';

export class HandleProtocolService {

  constructor() { }

  public initializeUrl() {
  }

  public decodeBase64String(args: string) {
	return atob(args);
  }

  private parseParam(uri: URL) {

  }

  private isValidVantage3xProtocol() {

  }

  private isValidVantage2xProtocol() {

  }
}

