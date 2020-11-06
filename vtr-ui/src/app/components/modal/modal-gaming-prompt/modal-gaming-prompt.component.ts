import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'vtr-modal-gaming-prompt',
    templateUrl: './modal-gaming-prompt.component.html',
    styleUrls: ['./modal-gaming-prompt.component.scss']
})

export class ModalGamingPromptComponent implements OnInit {
    @Output() emitService = new EventEmitter();

    public info: any = {
        id: {
            section: '',
            headerText: '',
            closeButton: '',
            description: '',
            okButton: '',
            cancelButton: ''
        }
    };
    public isChecked: any;

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        setTimeout(() => {
            this.focusCloseButton();
        }, 230);
    }

    emitFn(info) {
        this.emitService.next(info);
    }

    closeModal() {
        this.emitFn(0);
        this.activeModal.close('close');
    }

    confirmFn(){
        this.emitFn(1);
        this.activeModal.close('close');
    }

    cancelFn() {
        this.emitFn(2);
        this.activeModal.close('close');
    }

    setNotAskAgain() {
        this.isChecked = !this.isChecked;
        this.emitFn(this.isChecked);
    }

    focusCloseButton() {
        const elem: HTMLElement = document.querySelector('.gaming-advanced-prompt-close');
        if (elem) { elem.focus(); }
    }
}
