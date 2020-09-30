import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BatteryConditionModel } from 'src/app/data-models/battery/battery-conditions.model';
import AcAdapter from 'src/app/data-models/power/ac-adapter.model';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
import {
  BatteryConditionsEnum as Conditions,
  BatteryStatus as Status
} from 'src/app/enums/battery-conditions.enum';

@Component({
  selector: 'vtr-battery-condition-notes',
  templateUrl: './battery-condition-notes.component.html',
  styleUrls: ['./battery-condition-notes.component.scss']
})
export class BatteryConditionNotesComponent implements OnInit, OnChanges {

  @Input() batteryConditions: BatteryConditionModel[] = [];
  @Input() batteryGauge: BatteryGaugeDetail;
  @Input() batteryFullChargeCapacity: number;
  @Input() batteryDesignCapacity: number;

  public _notes: string[];
  public canShowAcDetailedNote = false;
  public acAdapter: AcAdapter;
  public storeLimitationValue: object;
  static readonly AC_CONNECTED_TEXT = 'device.deviceSettings.batteryGauge.condition.AcAdapterConnected';

  constructor() {  }

  ngOnInit(): void {
    this.setOrUpdateNotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setOrUpdateNotes();
  }

  private setOrUpdateNotes(): void {
    this.setAdapterInfo();
    this.setStoreLimitationForFairAndBadCondition();
    this.notes = this.getTranslatedConditionTips();
  }

  private setAdapterInfo(): void {
    this.acAdapter = new AcAdapter(this.batteryGauge.acWattage, this.batteryGauge.acAdapterType, this.batteryGauge.isAttached);
  }

  public getTranslatedConditionTips(): string[] {
		return this.batteryConditions.map(condition => this.buildTranslatedTip(condition));
  }

  public buildTranslatedTip(condition: BatteryConditionModel): string {
    let translation = condition.getBatteryConditionTip(condition.condition);
    const translationRephrasing = this.conditionRephrasing(condition);
    if (translationRephrasing){
      translation = translationRephrasing;
    }
    translation += this.getConditionSuffix(condition);
    return translation;
  }

  public getConditionSuffix(condition: BatteryConditionModel): string {
    if (this.isConditionStatusAdapter(condition) &&
        condition.condition !== Conditions.FullACAdapterSupport &&
        this.canShowAcDetailedNote) {
        return 'Detail';
    }
    return '';
  }

  public conditionRephrasing(condition: BatteryConditionModel): string {
    const isAcAdapterConnected = this.isConditionStatusAdapter(condition);
    const isAcAdapterSupported = condition.condition == Conditions.FullACAdapterSupport;
    const isAcAdapterInfoUnknown = (this.acAdapter?.isAttached) && (this.acAdapter.wattage == 0);
    if ( isAcAdapterConnected && isAcAdapterSupported && isAcAdapterInfoUnknown ) {
      return BatteryConditionNotesComponent.AC_CONNECTED_TEXT;
	}

	return '';
  }

  showDetailedNote(index: number) {
		this.canShowAcDetailedNote = true;
		this.notes[index] = this.notes[index] + 'Detail';
  }

  public getCondition(index: number): string {
    return Conditions[this.batteryConditions[index].condition];
  }

  public setStoreLimitationForFairAndBadCondition() {
    const percentLimit = (this.batteryFullChargeCapacity / this.batteryDesignCapacity) * 100;
    this.storeLimitationValue = { value: parseFloat(percentLimit.toFixed(1)) };
  }

  public canShowSeeDetailsLink(index: number): boolean {
    return this.batteryConditions[index].conditionStatus === Status.AcAdapterStatus &&
      !this.isAcAdapterInUse(index) && !this.canShowAcDetailedNote;
  }

  private isConditionStatusAdapter(condition): boolean {
    return condition.conditionStatus === Status.AcAdapterStatus;
  }

  public isStoreLimitated(index: number): boolean {
    return this.batteryConditions[index].condition == Conditions.StoreLimitation;
  }

  public canShowStoreLimitatedNote(index: number): boolean {
    return this.isStoreLimitated(index) && !this.isStatusGood(index);
  }

  public isAcAdapterNotSupported(index: number): boolean {
    return this.batteryConditions[index].condition == Conditions.NotSupportACAdapter;
  }

  public isAcAdapterInUse(index: number): boolean {
    return this.batteryConditions[index].condition == Conditions.FullACAdapterSupport;
  }

  public isStatusGood(index: number): boolean {
    return this.batteryConditions[index].conditionStatus == Status.Good;
  }

  public isStatusFair(index: number): boolean {
    return this.batteryConditions[index].conditionStatus == Status.Fair;
  }

  public isStatusPoor(index: number): boolean {
    return this.batteryConditions[index].conditionStatus == Status.Poor;
  }

  public canShowPoorNote(index: number): boolean {
    return this.isStatusPoor(index) && !this.isConditionError(index);
  }

  public isConditionError(index: number): boolean {
    return this.batteryConditions[index].condition == Conditions.Error;
  }

  public canShowFullSupportAdapterNote(index: number): boolean {
    return this.isAcAdapterInUse(index) && this.acAdapter && this.acAdapter.isAttached && this.acAdapter.wattage != 0;
  }

  public canShowAdapterIcon(index: number): boolean {
    return this.isAcAdapterInUse(index) && this.acAdapter && this.acAdapter.isAttached;
  }

  public canShowAcAdapterConnectedNote(index: number): boolean {
    return this.isAcAdapterInUse(index) && (this.acAdapter?.wattage == 0);
  }

  get notes(): string[] {
    return this._notes;
  }

  set notes(newNotes) {
    this._notes = newNotes;
  }
}