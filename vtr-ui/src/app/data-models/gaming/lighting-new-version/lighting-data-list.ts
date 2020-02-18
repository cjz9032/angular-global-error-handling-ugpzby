export class LightingDataList{
    public lightingEffectRgbData:any = {
        curSelected: 1,
        modeType: 1,
        dropOptions: [   
            {
              header: 'gaming.lightingProfile.effect.option8.title', 
              name: 'gaming.lightingProfile.effect.option8.title',
              id: 'lighting_effect_off',
              label: 'Off',
              metricitem: 'lighting_effect_off',
              value: 268435456
            },
            {
              header: 'gaming.lightingNewversion.lightingEffect.effectName1',
              name: 'gaming.lightingNewversion.lightingEffect.effectName1',
              id: 'lighting_effect_static',
              label: 'Static',
              metricitem: 'lighting_effect_static',
              value: 1
            },
            {
              header: 'gaming.lightingProfile.effect.option2.title',
              name: 'gaming.lightingProfile.effect.option2.title',
              id: 'lighting_effect_flicker',
              label: 'Flicker',
              metricitem: 'lighting_effect_flicker',
              value: 2
            },
            {
              header: 'gaming.lightingProfile.effect.option3.title',
              name: 'gaming.lightingProfile.effect.option3.title',
              id: 'lighting_effect_breath',
              label: 'Breath',
              metricitem: 'lighting_effect_breath',
              value: 4
            },
            {
              header: 'gaming.lightingProfile.effect.option4.title',
              name: 'gaming.lightingProfile.effect.option4.title',
              id: 'lighting_effect_wave',
              label: 'Wave',
              metricitem: 'lighting_effect_wave',
              value: 8
            },
            {
              header: 'gaming.lightingNewversion.lightingEffect.effectName2',
              name: 'gaming.lightingNewversion.lightingEffect.effectName2',
              id: 'lighting_effect_spectrum',
              label: 'Spectrum',
              metricitem: 'lighting_effect_spectrum',
              value: 32
            },
            {   
              header: 'gaming.lightingProfile.effect.option6.title',
              name: 'gaming.lightingProfile.effect.option6.title',
              id: 'lighting_effect_cpu_temperature',
              label: 'CPU Temperature',  
              metricitem: 'lighting_effect_cpu_temperature',
              value: 64
            },
            {
              header: 'gaming.lightingNewversion.lightingEffect.effectName3',
              name: 'gaming.lightingNewversion.lightingEffect.effectName3',
              id: 'lighting_effect_rainbow',
              label: 'Rainbow',
              metricitem: 'lighting_effect_rainbow',
              value: 256
            },
            {
              header: 'gaming.lightingNewversion.lightingEffect.effectName4',
              name: 'gaming.lightingNewversion.lightingEffect.effectName4',
              id: 'lighting_effect_random',
              label: 'Random',
              metricitem: 'lighting_effect_random',
              value: 512
            }
        ]
    };
    public lightingEffectSingleData:any = {
          curSelected: 1,
          modeType: 1,
          dropOptions: [
          {
            header: 'gaming.lightingProfile.effect.option8.title',
            name: 'gaming.lightingProfile.effect.option8.title',
            id: 'lighting_effect_off',
            label: 'Off',
            metricitem: 'lighting_effect_off',
            value: 268435456
          },
          {
              header: 'gaming.lightingProfile.lightingSingleLightingOption.option1.title',
              name: 'gaming.lightingProfile.lightingSingleLightingOption.option1.title',
              id: 'lighting_effect_always',
              label: 'Always On',
              metricitem: 'lighting_effect_always',
              value: 1
          },
          {
              header: 'gaming.lightingProfile.lightingSingleLightingOption.option2.title',
              name: 'gaming.lightingProfile.lightingSingleLightingOption.option2.title',
              id: 'lighting_effect_fast_blink',
              label: 'Fast Blink',
              metricitem: 'lighting_effect_fast_blink',
              value: 2
          },
          {
              header: 'gaming.lightingProfile.lightingSingleLightingOption.option4.title',
              name: 'gaming.lightingProfile.lightingSingleLightingOption.option4.title',
              id: 'lighting_effect_slow_blink',
              label: 'Slow Blink',
              metricitem: 'lighting_effect_slow_blink',
              value: 3
          },
          {
              header: 'gaming.lightingProfile.effect.option3.title',
              name: 'gaming.lightingProfile.effect.option3.title',
              id: 'lighting_effect_breath',
              label: 'Breath',
              metricitem: 'lighting_effect_breath',
              value: 4
          },
          ]
    };
    public lightingPanelImage:any = [
      {
          value:1, 
          pathUrl:"M244.677935,94.3426366 L243.543746,92.3321848 C243.465924,92.1942393 243.475584,92.0236016 243.568476,91.8953199 C243.63892,91.7980384 243.774889,91.7762824 243.87217,91.8467266 C243.882585,91.8542683 243.892311,91.8627189 243.901232,91.871979 L249.245429,97.4188079 L255.476114,92.5287073 C255.491114,92.5169341 255.505775,92.5047342 255.520078,92.4921226 L255.795208,92.2495303 C255.814273,92.2327201 255.843356,92.2345479 255.860166,92.2536128 C255.874283,92.2696235 255.875539,92.29324 255.863198,92.310657 L250.684979,99.6190817 C250.575894,99.7730421 250.512594,99.9547238 250.502392,100.143136 L249.766046,113.742108 C249.758062,113.889556 249.717522,114.033407 249.647339,114.163327 L249.464233,114.502286 C249.416488,114.590668 249.306135,114.623612 249.217753,114.575867 C249.163793,114.546718 249.128157,114.492338 249.122967,114.431228 L247.920737,100.275147 C247.908592,100.132139 247.865806,99.9934209 247.795286,99.8684183 L245.486793,95.7764081 C245.205645,96.7811441 245.047619,97.9129729 245.047619,99.1101239 C245.047619,102.63294 246.416015,105.590114 248.263403,106.407564 L248.544145,113.992772 C244.299687,113.152127 241,106.779754 241,99.0434154 C241,96.0603031 241.490615,93.2799926 242.336832,90.9414328 L244.677935,94.3426366 Z M242.842423,89.6897684 C244.399593,86.2228327 246.803123,84 249.5,84 C252.47864,84 255.099433,86.7115667 256.617297,90.8160396 L252.551939,94.2721095 C251.772324,92.6312359 250.603782,91.5884162 249.297619,91.5884162 C248.126523,91.5884162 247.066057,92.4267167 246.297351,93.7827519 L242.842423,89.6897684 Z M257.013628,92.0031504 C257.643311,94.1037136 258,96.4998436 258,99.0434154 C258,106.802363 254.680999,113.189361 250.418619,114 L250.450378,106.351857 C252.237461,105.462629 253.547619,102.557161 253.547619,99.1101239 C253.547619,98.1960286 253.455486,97.3200175 253.286759,96.5095906 L257.013628,92.0031504 Z",
          panelName:"gaming.lightingNewversion.machineName.name1", 
          panelImage:"./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png",
          panelImageType:true
        },
        {
          value:2,
          pathUrl:"M60.0974955,72.742862 L187.393262,57.0299423 C188.222058,56.9751855 188.849912,56.2532594 188.795613,55.4174752 C188.741314,54.5816911 188.025424,53.9485434 187.196628,54.0033002 L59.9008614,69.7162199 C59.0720654,69.7709767 58.4442116,70.4929028 58.4985106,71.328687 C58.5528096,72.1644711 59.2686995,72.7976188 60.0974955,72.742862 Z",
          panelName:"gaming.lightingNewversion.machineName.name2",
          panelImage:"./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png",
          panelImageType:true
        },
        {
          value:4,
          pathUrl:"M142,70.2158371 L142,138.463161 L96.7288556,135.333846 C94.6298419,135.188754 93.0020525,133.442363 93.0046959,131.338342 L93.079841,71.5259258 C93.0826165,69.3167885 94.875726,67.5281789 97.0848633,67.5309543 C97.3012982,67.5312262 97.5173541,67.5490642 97.730903,67.5842925 L106.591653,69.0460164 L107.716535,67.7878637 C108.588138,66.8129972 109.881228,66.3257313 111.179432,66.4829649 L142,70.2158371 Z",
          panelName:"gaming.lightingNewversion.machineName.name3",
          panelImage:"./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png",
          panelImageType:true
        },
        {
          value:8,
          pathUrl:"M93,77.2363729 L93,131.203481 C93,133.362239 94.7129566,135.131543 96.8705844,135.201387 L99.4557235,135.28507 C99.2759577,137.345442 97.536855,138.95248 95.4337782,138.932887 C95.4238652,138.932795 95.4139526,138.932666 95.4040405,138.9325 L43.9329996,138.070233 C41.7502882,138.033667 40,136.253812 40,134.070794 L40,78.0181698 C40,75.8090308 41.790861,74.0181698 44,74.0181698 C44.1130982,74.0181698 44.2261455,74.0229665 44.3388372,74.032547 L51.5956712,74.6494858 L52.4347283,73.6627954 C53.3160564,72.6263965 54.6637317,72.1090044 56.0121882,72.2893567 L93,77.2363729 Z",
          panelName:"gaming.lightingNewversion.machineName.name4",
          panelImage:"./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png",
          panelImageType:true
        },
        {
          value:16,
          pathUrl:"M116.376973,110.265793 L113.600958,107.046518 C113.299451,106.696867 113.338479,106.169 113.688129,105.867492 C113.70837,105.850039 113.729436,105.833566 113.751254,105.818131 L113.968653,105.664333 C114.292963,105.434902 114.722325,105.419196 115.062531,105.624318 L127.347432,113.03134 C127.684747,113.23472 128.11003,113.221144 128.433688,112.996664 L142.148084,103.48475 C142.548768,103.206847 143.093,103.266862 143.423501,103.625394 C143.75397,103.983891 143.769467,104.531181 143.459815,104.907804 L131.885916,118.984875 C131.763311,119.133996 131.686491,119.315418 131.66473,119.50724 L128.600657,146.516606 C128.543319,147.022033 128.1157,147.403884 127.607031,147.403884 L127.519882,147.403884 C126.997542,147.403884 126.563195,147.001871 126.522867,146.48109 L124.468132,119.94678 C124.45167,119.734188 124.367684,119.532424 124.228437,119.370941 L118.536425,112.770056 C118.158053,114.292829 117.952381,115.929408 117.952381,117.633475 C117.952381,123.991441 120.8155,129.409934 124.8292,131.483029 L125.397609,146.645528 C114.406299,144.427801 106,132.224473 106,117.502649 C106,112.354584 107.027944,107.514487 108.834909,103.301659 L116.376973,110.265793 Z M109.996303,100.87856 C114.138111,93.1032416 121.104448,88 129,88 C136.226685,88 142.674922,92.2752288 146.891426,98.9615215 L136.076295,107.490374 C134.162613,104.652367 131.454646,102.882151 128.452381,102.882151 C125.179862,102.882151 122.25701,104.985408 120.33135,108.282222 L109.996303,100.87856 Z M147.859689,100.611379 C150.469092,105.396267 152,111.220131 152,117.502649 C152,133.303432 142.316356,146.203031 130.146376,146.969289 L130.955581,131.963013 C135.545975,130.38574 138.952381,124.568478 138.952381,117.633475 C138.952381,115.560767 138.648097,113.587903 138.098862,111.798241 L147.859689,100.611379 Z",
          panelName:"gaming.lightingNewversion.machineName.name5",
          panelImage:"./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_water_cold.png",
          panelImageType:true
        },
        {
          value:32,
          pathUrl:"M45.4912211,74.2854706 L52.7430349,74.9111843 L53.5787919,73.913706 C54.4609815,72.8608101 55.8217221,72.3342277 57.1828649,72.5189939 L97.6532056,78.0125767 C99.6500747,78.2836385 101.133495,79.9978428 101.114998,82.0129405 L100.617693,136.190913 C100.597416,138.399959 98.7901931,140.174306 96.5811471,140.154029 C96.5707182,140.153934 96.5602897,140.153797 96.5498618,140.15362 L45.0793636,139.278493 C42.8970505,139.241388 41.1473637,137.4617 41.1473637,135.279071 L41.1473637,78.2706634 C41.1473637,76.0615244 42.9382247,74.2706634 45.1473637,74.2706634 C45.2621422,74.2706634 45.3768675,74.2756037 45.4912211,74.2854706 Z",
          panelName:"gaming.lightingNewversion.machineName.name6",
          panelImage:"./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_water_cold.png",
          panelImageType:true
        },
        {
          value:64,
          pathUrl:"M169.792391,101.277748 L169.792391,100.094851 L216.644358,125.929436 L238.193431,99.4037325 C238.263243,99.3177973 238.389501,99.3047273 238.475436,99.3745396 C238.522296,99.4126073 238.549504,99.4697657 238.549504,99.5301389 L238.549504,99.7938601 C238.549504,99.9901711 238.491723,100.18214 238.383364,100.345836 L218.593929,130.241372 L220.816192,269.556659 L220.052571,269.556659 L213.874514,130.241372 L169.792391,101.277748 Z",
          panelName:"gaming.lightingNewversion.machineName.name7",
          panelImage:"./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_big_y.png",
          panelImageType:false
        },
        {
          value:128,
          pathUrl:"M139.624634,262.773412 L184.098279,253.470198 L180.362225,255.999311 C180.253983,256.072585 180.132425,256.123928 180.00443,256.150434 L145.07033,263.38487 C144.963815,263.406928 144.854414,263.411459 144.74644,263.398286 L139.624634,262.773412 Z",
          panelName:"gaming.lightingNewversion.machineName.name9",
          panelImage:"./../../../../assets/images/gaming/lighting/lighting-ui-new/T550G_front_line.png",
          panelImageType:false
        },
        {
          value:256,
          pathUrl:"M193.762975,108.497421 C186.020189,107.589461 180,100.683688 180,92.2993137 C180,89.0791808 180.888007,86.0771487 182.420557,83.5492364 L187.574735,89.0790576 C187.203611,90.0775655 187,91.1635692 187,92.2993137 C187,96.4671557 189.741962,99.9651539 193.442036,100.927498 L193.762975,108.497421 L193.762975,108.497421 Z M183.55169,81.9158556 C186.394719,78.3023397 190.691675,76 195.5,76 C200.668433,76 205.246032,78.660109 208.062214,82.7493773 L201.427584,85.9272974 C199.896373,84.3687217 197.805365,83.4087789 195.5,83.4087789 C193.147738,83.4087789 191.018643,84.4081744 189.479668,86.0231539 L183.55169,81.9158556 L183.55169,81.9158556 Z M209.211719,84.6919378 C210.353493,86.9629161 211,89.5517215 211,92.2993137 C211,100.702544 204.952702,107.620515 197.184759,108.503456 L197.5376,100.932766 C201.247973,99.9779801 204,96.4747982 204,92.2993137 C204,90.9741508 203.72281,89.7167036 203.225767,88.5869432 L209.211719,84.6919378 L209.211719,84.6919378 Z M184.402759,84.1444152 L194.866689,90.0038788 C195.154288,90.1649253 195.502778,90.1739016 195.798287,90.0278746 L207.70441,84.1444152 L197.497356,93.0849647 C197.30822,93.2506323 197.188432,93.4814685 197.161854,93.7314919 L195.32617,111 L193.288357,93.6766075 C193.262867,93.4599171 193.167207,93.2575091 193.015964,93.1002505 L184.402759,84.1444152 Z",
          panelName:"gaming.lightingNewversion.machineName.name1",
          panelImage:"./../../../../assets/images/gaming/lighting/lighting-ui-new/T550_front.png",
          panelImageType:false
        }
    ];
    public presetColorListData:any = [
        {"color":"FFECE6","isChecked":false},
        {"color":"FFFBE6","isChecked":false},
        {"color":"E6FFCC","isChecked":false},
        {"color":"CCFFF9","isChecked":false},
        {"color":"CCEBFF","isChecked":false},
        {"color":"CCD1FF","isChecked":false},
        {"color":"FCCCFF","isChecked":false},
        {"color":"FFFFFF","isChecked":false},
        {"color":"FF9069","isChecked":false},
        {"color":"FFEF9E","isChecked":false},
        {"color":"BFFF87","isChecked":false},
        {"color":"91FFF7","isChecked":false},
        {"color":"51C0FF","isChecked":false},
        {"color":"5F78FF","isChecked":false},
        {"color":"F98EFF","isChecked":false},
        {"color":"CCCCCC","isChecked":false},
        {"color":"FF4300","isChecked":false},
        {"color":"FFD400","isChecked":false},
        {"color":"80FF00","isChecked":false},
        {"color":"00FFE2","isChecked":false},
        {"color":"009EFF","isChecked":false},
        {"color":"0031FF","isChecked":false},
        {"color":"E700FF","isChecked":false},
        {"color":"999999","isChecked":false},
        {"color":"AD2D00","isChecked":false},
        {"color":"987F00","isChecked":false},
        {"color":"4FA900","isChecked":false},
        {"color":"00A994","isChecked":false},
        {"color":"0063BB","isChecked":false},
        {"color":"0018BB","isChecked":false},
        {"color":"8700A8","isChecked":false},
        {"color":"666666","isChecked":false},
        {"color":"661B00","isChecked":false},
        {"color":"675600","isChecked":false},
        {"color":"2A5C00","isChecked":false},
        {"color":"005646","isChecked":false},
        {"color":"003984","isChecked":false},
        {"color":"000471","isChecked":false},
        {"color":"480062","isChecked":false},
        {"color":"333333","isChecked":false}
    ];
    public lightingEffectNoteData:any = {
      curSelected: 1,
      modeType: 1,
      dropOptions: [
          {
            header: 'gaming.lightingProfile.effect.option8.title',
            name: 'gaming.lightingProfile.effect.option8.title',
            id: 'lighting_effect_off',
            label: 'Off',
            metricitem: 'lighting_effect_off',
            value: 268435456
          },
          {
            header: 'gaming.lightingNewversion.lightingEffect.effectName1',
            name: 'gaming.lightingNewversion.lightingEffect.effectName1',
            id: 'lighting_effect_static',
            label: 'Static',
            metricitem: 'lighting_effect_static',
            value: 1
          },
          {
            header: 'gaming.lightingProfile.effect.option3.title',
            name: 'gaming.lightingProfile.effect.option3.title',
            id: 'lighting_effect_breath',
            label: 'Breath',
            metricitem: 'lighting_effect_breath',
            value: 4
          },
          {     
            header: 'gaming.lightingProfile.effect.option5.title',
            name: 'gaming.lightingProfile.effect.option5.title',
            id: 'lighting_effect_smooth',
            label: 'Smooth',
            metricitem: 'lighting_effect_smooth',
            value: 32
          },
          {
            header: 'gaming.lightingNewversion.lightingEffect.effectName5',
            name: 'gaming.lightingNewversion.lightingEffect.effectName5',
            id: 'lighting_effect_cool_blue',
            label: 'Cool_Blue',
            metricitem: 'lighting_effect_cool_blue',
            value: 1024
          },
          {
            header: 'gaming.lightingNewversion.lightingEffect.effectName6',
            name: 'gaming.lightingNewversion.lightingEffect.effectName6',
            id: 'lighting_effect_wave_right',
            label: 'Wave_Right',
            metricitem: 'lighting_effect_wave_right',
            value: 4096
          },
          {
            header: 'gaming.lightingNewversion.lightingEffect.effectName7',
            name: 'gaming.lightingNewversion.lightingEffect.effectName7',
            id: 'lighting_effect_wave_left',
            label: 'Wave_Left',
            metricitem: 'lighting_effect_wave_left',
            value: 8192
          }
      ]
    };
    public lightingCapality:any = {
      "LightPanelType":[],
      "LedType_Complex":[],
      "LedType_simple":[],
      "BrightAdjustLevel":0,
      "RGBfeature":1,
      "SpeedSetLevel":0,
      "SupportBrightnessSetList":[],
      "SupportRGBSetList":[],
      "SupportSpeedSetList":[],
      "UnifySetList":[]
    };
    public lightingCurrentDetailDesk:any = {
      "lightPanelType": 1, 
      "lightEffectType": 1,
      "lightBrightness": 1,
      "lightSpeed": 3,
      "lightColor": "",
      "panelImage": "",
      "panelImageType": true,
      "currentEffectName": "",
      "length": 1,
      "panelName": "",
      "pathUrl": ""
    };
    public lightingCurrentDetailNote:any = {
      "lightPanelType": 1,
      "lightEffectType": 1,
      "lightBrightness": 1,
      "lightSpeed": 1,
      "lightColor": "",
      "lightingEffectName": ""
    }
}