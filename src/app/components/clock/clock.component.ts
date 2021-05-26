import { Component, OnInit } from "@angular/core";
import { lineFeature, featureLogContainer } from 'src/app/line-feature';
import { FeatureNodeTypeEnum } from 'src/app/line-feature/log-container';

@Component({
  selector: "vtr-menu-main",
  templateUrl: "./clock.component.html",
  styleUrls: ["./clock.component.scss"],
})
export class ClockComponent  implements OnInit{


  @lineFeature({
    featureName: ["use-case-2"],
    node: {
      nodeName: "endF1ActionInOtherComponent",
      nodeType: FeatureNodeTypeEnum.start,
    },
  })
  ngOnInit() {
    console.log("success");
  }

  getLogContainer(){
	const tmp = featureLogContainer.toJSON()
	debugger
  }
}
