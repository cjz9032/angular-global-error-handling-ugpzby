export class LightingDataList{
    public lightingEffectRgbData:any = {
        curSelected: 1,
        modeType: 1,
        dropOptions: [   
            {
              header: 'gaming.lightingProfile.effect.option8.title', 
              name: 'gaming.lightingProfile.effect.option8.title',
              id: 'lighting_effect_off',
              label: 'gaming.lightingProfile.effect.option8.title',
              metricitem: 'lighting_effect_off',
              value: 268435456
            },
            {
              header: 'gaming.lightingNewversion.lightingEffect.effectName1',
              name: 'gaming.lightingNewversion.lightingEffect.effectName1',
              id: 'lighting_effect_static',
              label: 'gaming.lightingNewversion.lightingEffect.effectName1',
              metricitem: 'lighting_effect_static',
              value: 1
            },
            {
              header: 'gaming.lightingProfile.effect.option2.title',
              name: 'gaming.lightingProfile.effect.option2.title',
              id: 'lighting_effect_flicker',
              label: 'gaming.lightingProfile.effect.option2.title',
              metricitem: 'lighting_effect_flicker',
              value: 2
            },
            {
              header: 'gaming.lightingProfile.effect.option3.title',
              name: 'gaming.lightingProfile.effect.option3.title',
              id: 'lighting_effect_breath',
              label: 'gaming.lightingProfile.effect.option3.title',
              metricitem: 'lighting_effect_breath',
              value: 4
            },
            {
              header: 'gaming.lightingProfile.effect.option4.title',
              name: 'gaming.lightingProfile.effect.option4.title',
              id: 'lighting_effect_wave',
              label: 'gaming.lightingProfile.effect.option4.title',
              metricitem: 'lighting_effect_wave',
              value: 8
            },
            {
              header: 'gaming.lightingNewversion.lightingEffect.effectName2',
              name: 'gaming.lightingNewversion.lightingEffect.effectName2',
              id: 'lighting_effect_spectrum',
              label: 'gaming.lightingNewversion.lightingEffect.effectName2',
              metricitem: 'lighting_effect_spectrum',
              value: 32
            },
            {   
              header: 'gaming.lightingProfile.effect.option6.title',
              name: 'gaming.lightingProfile.effect.option6.title',
              id: 'lighting_effect_cpu_temperature',
              label: 'gaming.lightingProfile.effect.option6.title',  
              metricitem: 'lighting_effect_cpu_temperature',
              value: 64,
              show_tool_tip: true
            },
            {
              header: 'gaming.lightingNewversion.lightingEffect.effectName3',
              name: 'gaming.lightingNewversion.lightingEffect.effectName3',
              id: 'lighting_effect_rainbow',
              label: 'gaming.lightingNewversion.lightingEffect.effectName3',
              metricitem: 'lighting_effect_rainbow',
              value: 256
            },
            {
              header: 'gaming.lightingNewversion.lightingEffect.effectName4',
              name: 'gaming.lightingNewversion.lightingEffect.effectName4',
              id: 'lighting_effect_random',
              label: 'gaming.lightingNewversion.lightingEffect.effectName4',
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
            label: 'gaming.lightingProfile.effect.option8.title',
            metricitem: 'lighting_effect_off',
            value: 268435456
          },
          {
              header: 'gaming.lightingProfile.lightingSingleLightingOption.option1.title',
              name: 'gaming.lightingProfile.lightingSingleLightingOption.option1.title',
              id: 'lighting_effect_always',
              label: 'gaming.lightingProfile.lightingSingleLightingOption.option1.title',
              metricitem: 'lighting_effect_always',
              value: 1,
              show_tool_tip: true
          },
          {
              header: 'gaming.lightingProfile.lightingSingleLightingOption.option2.title',
              name: 'gaming.lightingProfile.lightingSingleLightingOption.option2.title',
              id: 'lighting_effect_fast_blink',
              label: 'gaming.lightingProfile.lightingSingleLightingOption.option2.title',
              metricitem: 'lighting_effect_fast_blink',
              value: 2,
              show_tool_tip: true
          },
          {
              header: 'gaming.lightingProfile.lightingSingleLightingOption.option4.title',
              name: 'gaming.lightingProfile.lightingSingleLightingOption.option4.title',
              id: 'lighting_effect_slow_blink',
              label: 'gaming.lightingProfile.lightingSingleLightingOption.option4.title',
              metricitem: 'lighting_effect_slow_blink',
              value: 3,
              show_tool_tip: true
          },
          {
              header: 'gaming.lightingProfile.effect.option3.title',
              name: 'gaming.lightingProfile.effect.option3.title',
              id: 'lighting_effect_breath',
              label: 'gaming.lightingProfile.effect.option3.title',
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
          panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png",
          panelImageType:true
        },
        {
          value:2,
          pathUrl:"M60.0974955,72.742862 L187.393262,57.0299423 C188.222058,56.9751855 188.849912,56.2532594 188.795613,55.4174752 C188.741314,54.5816911 188.025424,53.9485434 187.196628,54.0033002 L59.9008614,69.7162199 C59.0720654,69.7709767 58.4442116,70.4929028 58.4985106,71.328687 C58.5528096,72.1644711 59.2686995,72.7976188 60.0974955,72.742862 Z",
          panelName:"gaming.lightingNewversion.machineName.name2",
          panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png",
          panelImageType:true
        },
        {
          value:4,
          pathUrl:"M142,70.2158371 L142,138.463161 L96.7288556,135.333846 C94.6298419,135.188754 93.0020525,133.442363 93.0046959,131.338342 L93.079841,71.5259258 C93.0826165,69.3167885 94.875726,67.5281789 97.0848633,67.5309543 C97.3012982,67.5312262 97.5173541,67.5490642 97.730903,67.5842925 L106.591653,69.0460164 L107.716535,67.7878637 C108.588138,66.8129972 109.881228,66.3257313 111.179432,66.4829649 L142,70.2158371 Z",
          panelName:"gaming.lightingNewversion.machineName.name4",
          panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png",
          panelImageType:true
        },
        {
          value:8,
          pathUrl:"M93,77.2363729 L93,131.203481 C93,133.362239 94.7129566,135.131543 96.8705844,135.201387 L99.4557235,135.28507 C99.2759577,137.345442 97.536855,138.95248 95.4337782,138.932887 C95.4238652,138.932795 95.4139526,138.932666 95.4040405,138.9325 L43.9329996,138.070233 C41.7502882,138.033667 40,136.253812 40,134.070794 L40,78.0181698 C40,75.8090308 41.790861,74.0181698 44,74.0181698 C44.1130982,74.0181698 44.2261455,74.0229665 44.3388372,74.032547 L51.5956712,74.6494858 L52.4347283,73.6627954 C53.3160564,72.6263965 54.6637317,72.1090044 56.0121882,72.2893567 L93,77.2363729 Z",
          panelName:"gaming.lightingNewversion.machineName.name3",
          panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png",
          panelImageType:true
        },
        {
          value:16,
          pathUrl:"M116.376973,110.265793 L113.600958,107.046518 C113.299451,106.696867 113.338479,106.169 113.688129,105.867492 C113.70837,105.850039 113.729436,105.833566 113.751254,105.818131 L113.968653,105.664333 C114.292963,105.434902 114.722325,105.419196 115.062531,105.624318 L127.347432,113.03134 C127.684747,113.23472 128.11003,113.221144 128.433688,112.996664 L142.148084,103.48475 C142.548768,103.206847 143.093,103.266862 143.423501,103.625394 C143.75397,103.983891 143.769467,104.531181 143.459815,104.907804 L131.885916,118.984875 C131.763311,119.133996 131.686491,119.315418 131.66473,119.50724 L128.600657,146.516606 C128.543319,147.022033 128.1157,147.403884 127.607031,147.403884 L127.519882,147.403884 C126.997542,147.403884 126.563195,147.001871 126.522867,146.48109 L124.468132,119.94678 C124.45167,119.734188 124.367684,119.532424 124.228437,119.370941 L118.536425,112.770056 C118.158053,114.292829 117.952381,115.929408 117.952381,117.633475 C117.952381,123.991441 120.8155,129.409934 124.8292,131.483029 L125.397609,146.645528 C114.406299,144.427801 106,132.224473 106,117.502649 C106,112.354584 107.027944,107.514487 108.834909,103.301659 L116.376973,110.265793 Z M109.996303,100.87856 C114.138111,93.1032416 121.104448,88 129,88 C136.226685,88 142.674922,92.2752288 146.891426,98.9615215 L136.076295,107.490374 C134.162613,104.652367 131.454646,102.882151 128.452381,102.882151 C125.179862,102.882151 122.25701,104.985408 120.33135,108.282222 L109.996303,100.87856 Z M147.859689,100.611379 C150.469092,105.396267 152,111.220131 152,117.502649 C152,133.303432 142.316356,146.203031 130.146376,146.969289 L130.955581,131.963013 C135.545975,130.38574 138.952381,124.568478 138.952381,117.633475 C138.952381,115.560767 138.648097,113.587903 138.098862,111.798241 L147.859689,100.611379 Z",
          panelName:"gaming.lightingNewversion.machineName.name5",
          panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550_water_cold.png",
          panelImageType:true
        },
        {
          value:32,
          pathUrl:"M45.4912211,74.2854706 L52.7430349,74.9111843 L53.5787919,73.913706 C54.4609815,72.8608101 55.8217221,72.3342277 57.1828649,72.5189939 L97.6532056,78.0125767 C99.6500747,78.2836385 101.133495,79.9978428 101.114998,82.0129405 L100.617693,136.190913 C100.597416,138.399959 98.7901931,140.174306 96.5811471,140.154029 C96.5707182,140.153934 96.5602897,140.153797 96.5498618,140.15362 L45.0793636,139.278493 C42.8970505,139.241388 41.1473637,137.4617 41.1473637,135.279071 L41.1473637,78.2706634 C41.1473637,76.0615244 42.9382247,74.2706634 45.1473637,74.2706634 C45.2621422,74.2706634 45.3768675,74.2756037 45.4912211,74.2854706 Z",
          panelName:"gaming.lightingNewversion.machineName.name6",
          panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550_water_cold.png",
          panelImageType:true
        },
        {
          value:64,
          pathUrl:"M169.792391,101.277748 L169.792391,100.094851 L216.644358,125.929436 L238.193431,99.4037325 C238.263243,99.3177973 238.389501,99.3047273 238.475436,99.3745396 C238.522296,99.4126073 238.549504,99.4697657 238.549504,99.5301389 L238.549504,99.7938601 C238.549504,99.9901711 238.491723,100.18214 238.383364,100.345836 L218.593929,130.241372 L220.816192,269.556659 L220.052571,269.556659 L213.874514,130.241372 L169.792391,101.277748 Z",
          panelName:"gaming.lightingNewversion.machineName.name7",
          panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550_big_y.png",
          panelImageType:false
        },
        {
          value:128,
          pathUrl:"M139.624634,262.773412 L184.098279,253.470198 L180.362225,255.999311 C180.253983,256.072585 180.132425,256.123928 180.00443,256.150434 L145.07033,263.38487 C144.963815,263.406928 144.854414,263.411459 144.74644,263.398286 L139.624634,262.773412 Z",
          panelName:"gaming.lightingNewversion.machineName.name9",
          panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550G_front_line.png",
          panelImageType:false
        },
        {
          value:256,
          pathUrl:"M193.762975,108.497421 C186.020189,107.589461 180,100.683688 180,92.2993137 C180,89.0791808 180.888007,86.0771487 182.420557,83.5492364 L187.574735,89.0790576 C187.203611,90.0775655 187,91.1635692 187,92.2993137 C187,96.4671557 189.741962,99.9651539 193.442036,100.927498 L193.762975,108.497421 L193.762975,108.497421 Z M183.55169,81.9158556 C186.394719,78.3023397 190.691675,76 195.5,76 C200.668433,76 205.246032,78.660109 208.062214,82.7493773 L201.427584,85.9272974 C199.896373,84.3687217 197.805365,83.4087789 195.5,83.4087789 C193.147738,83.4087789 191.018643,84.4081744 189.479668,86.0231539 L183.55169,81.9158556 L183.55169,81.9158556 Z M209.211719,84.6919378 C210.353493,86.9629161 211,89.5517215 211,92.2993137 C211,100.702544 204.952702,107.620515 197.184759,108.503456 L197.5376,100.932766 C201.247973,99.9779801 204,96.4747982 204,92.2993137 C204,90.9741508 203.72281,89.7167036 203.225767,88.5869432 L209.211719,84.6919378 L209.211719,84.6919378 Z M184.402759,84.1444152 L194.866689,90.0038788 C195.154288,90.1649253 195.502778,90.1739016 195.798287,90.0278746 L207.70441,84.1444152 L197.497356,93.0849647 C197.30822,93.2506323 197.188432,93.4814685 197.161854,93.7314919 L195.32617,111 L193.288357,93.6766075 C193.262867,93.4599171 193.167207,93.2575091 193.015964,93.1002505 L184.402759,84.1444152 Z",
          panelName:"gaming.lightingNewversion.machineName.name1",
          panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550_front.png",
          panelImageType:false
        }
    ];
    public lightingPanelImageT750:any = [
      {
        value:1, 
        pathUrl:"M232.121374,88.5367111 C232.685746,90.4400604 233,92.5442901 233,94.7639961 C233,103.05261 229.998706,109.220475 224.706872,109.793098 L224.707531,102.580163 C227.105673,101.981862 228.5,98.7573527 228.5,94.8338999 C228.5,93.9660953 228.389205,93.1186768 228.188817,92.3180043 L232.121374,88.5367111 Z M214.838709,85.3526245 L218.973505,91.1502661 C218.732678,92.2725573 218.616375,93.5302248 218.616375,94.8338999 C218.616375,98.2863261 220.105972,101.197557 222.168814,102.254458 L222.703965,109.721642 C217.522984,108.707075 213.860337,101.127987 213.860337,93.0269813 C213.860337,90.029556 214.18123,87.4485945 214.838709,85.3526245 Z M217.231937,87.3008762 L223.358155,93.0885184 L230.578022,87.8474833 C230.733841,87.7343718 230.933635,87.7007494 231.117892,87.7566309 C231.222296,87.7882945 231.281264,87.8985993 231.2496,88.0030034 C231.241481,88.0297766 231.227767,88.0545198 231.209366,88.0755947 L224.847028,95.3625949 C224.703539,95.5269376 224.617732,95.7336968 224.60269,95.9513465 L223.769456,108.008013 C223.760558,108.136756 223.726826,108.26256 223.670119,108.378484 L223.557069,108.609588 C223.527076,108.670901 223.453057,108.696292 223.391743,108.666299 C223.352454,108.64708 223.32625,108.608527 223.322837,108.564922 L222.301143,95.5092527 C222.287288,95.3322104 222.226538,95.162051 222.125136,95.0162646 L216.953324,87.5806609 C216.894006,87.4953785 216.903705,87.3799683 216.976425,87.305782 C217.046023,87.2347801 217.159664,87.2325982 217.231937,87.3008762 Z M222.366539,79.1280465 C226.171065,79.1280465 229.560439,82.11077 231.441837,86.6210051 L227.168087,89.7704961 C226.083513,87.8896545 224.466212,86.6406524 222.812613,86.6406524 C221.491389,86.6406524 220.502958,87.4380137 219.818368,88.7179341 L215.602873,83.4330464 C216.990794,80.6520426 219.224968,79.1280465 222.366539,79.1280465 Z",
        panelName:"gaming.lightingNewversion.machineName.name1", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T750_wind.png",
        panelImageType:true
      },
      {
        value:2, 
        pathUrl:"M162.718111,48.0920767 C163.247999,47.9363936 163.803764,48.2397466 163.959447,48.7696345 C164.10401,49.2616733 163.852771,49.7760246 163.391884,49.9716415 L163.281889,50.0109706 L53.2818891,82.3293841 C52.7520012,82.4850672 52.1962361,82.1817142 52.040553,81.6518263 C51.8959902,81.1597875 52.1472288,80.6454362 52.6081156,80.4498193 L52.7181109,80.4104902 L162.718111,48.0920767 Z",
        panelName:"gaming.lightingNewversion.machineName.name2", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T750_wind.png",
        panelImageType:true
      },
      {
        value:4, 
        pathUrl:"M101,112a21.5,27 0 1,0 43,0a21.5,27 0 1,0 -43,0",
        panelName:"gaming.lightingNewversion.machineName.name4", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T750_wind.png",
        panelImageType:true
      },
      {
        value:8, 
        pathUrl:"M74,93 C78.4621701,93 82.5992889,94.6236616 86.0009736,97.3922048 L86.0009736,137.607795 C82.5992889,140.376338 78.4621701,142 74,142 C62.4020203,142 53,131.030976 53,117.5 C53,103.969024 62.4020203,93 74,93 Z",
        panelName:"gaming.lightingNewversion.machineName.name3", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T750_wind.png",
        panelImageType:true
      },
      {
        value:16, 
        pathUrl:"M136.682943,107.55799 C137.524006,109.781096 138,112.313209 138,115 C138,123.146827 133.623664,129.871535 127.963372,130.871682 L127.855551,122.755191 C130.237601,121.876983 132,118.737859 132,115 C132,113.782445 131.813003,112.628419 131.478503,111.595368 L136.682943,107.55799 Z M136.112665,105.319654 L128,115.473102 L126.850721,130.053452 L124.558708,115.949381 L121.239,112.662 L121.175279,112.988702 C121.060872,113.631342 121,114.305331 121,115 C121,118.588774 122.624616,121.625622 124.862454,122.639424 L124.862378,130.839008 C119.286771,129.733048 115,123.063031 115,115 C115,112.884414 115.295118,110.864728 115.8312,109.016285 L121.047,112.472 L117.217823,108.678898 L125.8387,112.981751 L136.112665,105.319654 Z M126.5,99 C130.054627,99 133.232577,101.243821 135.342057,104.768968 L129.84446,108.648502 C128.917737,107.614533 127.758208,107 126.5,107 C124.894287,107 123.449287,108.000867 122.443784,109.597097 L116.668967,106.694098 C118.686759,102.080888 122.33478,99 126.5,99 Z",
        panelName:"gaming.lightingNewversion.machineName.name5", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T750_water.png",
        panelImageType:true
      },
      {
        value:32, 
        pathUrl:"M53,117.5a21,24.5 0 1,0 42,0a21,24.5 0 1,0 -42,0",
        panelName:"gaming.lightingNewversion.machineName.name6", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T750_water.png",
        panelImageType:true
      },
      {
        value:64, 
        pathUrl:"M212.5,193 C223.821837,193 233,206.879173 233,224 C233,241.120827 223.821837,255 212.5,255 C201.178163,255 192,241.120827 192,224 C192,206.879173 201.178163,193 212.5,193 Z M212.5,129 C223.821837,129 233,142.879173 233,160 C233,177.120827 223.821837,191 212.5,191 C201.178163,191 192,177.120827 192,160 C192,142.879173 201.178163,129 212.5,129 Z M212.5,65 C223.821837,65 233,78.8791728 233,96 C233,113.120827 223.821837,127 212.5,127 C201.178163,127 192,113.120827 192,96 C192,78.8791728 201.178163,65 212.5,65 Z",
        panelName:"gaming.lightingNewversion.machineName.name11", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T750_wind.png",
        panelImageType:true
      },
      {
        value:128, 
        pathUrl:"M103.955118,72.0009299 L105.308113,72.0147506 C117.994799,72.2225041 128,74.5989537 128,77.5 C128,80.5375661 117.030976,83 103.5,83 L102.591776,82.9962909 C89.481573,82.8890384 79,80.4693062 79,77.5 C79,74.4965638 89.7239135,72.0554082 103.044882,72.0009299 L103.955118,72.0009299 Z M139.464406,61 L140.845013,61.0150784 C153.790611,61.2417377 164,63.8344474 164,66.9994927 C164,70.3134814 152.807119,73 139,73 L138.073241,72.9959534 C124.695483,72.8789407 114,70.2390097 114,66.9994927 C114,63.7227399 124.942769,61.0594358 138.535594,61 L139.464406,61 Z",
        panelName:"gaming.lightingNewversion.machineName.name12", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T750_wind.png",
        panelImageType:true
      },
      {
        value:256, 
        pathUrl:"M232.121374,88.5367111 C232.685746,90.4400604 233,92.5442901 233,94.7639961 C233,103.05261 229.998706,109.220475 224.706872,109.793098 L224.707531,102.580163 C227.105673,101.981862 228.5,98.7573527 228.5,94.8338999 C228.5,93.9660953 228.389205,93.1186768 228.188817,92.3180043 L232.121374,88.5367111 Z M214.838709,85.3526245 L218.973505,91.1502661 C218.732678,92.2725573 218.616375,93.5302248 218.616375,94.8338999 C218.616375,98.2863261 220.105972,101.197557 222.168814,102.254458 L222.703965,109.721642 C217.522984,108.707075 213.860337,101.127987 213.860337,93.0269813 C213.860337,90.029556 214.18123,87.4485945 214.838709,85.3526245 Z M217.231937,87.3008762 L223.358155,93.0885184 L230.578022,87.8474833 C230.733841,87.7343718 230.933635,87.7007494 231.117892,87.7566309 C231.222296,87.7882945 231.281264,87.8985993 231.2496,88.0030034 C231.241481,88.0297766 231.227767,88.0545198 231.209366,88.0755947 L224.847028,95.3625949 C224.703539,95.5269376 224.617732,95.7336968 224.60269,95.9513465 L223.769456,108.008013 C223.760558,108.136756 223.726826,108.26256 223.670119,108.378484 L223.557069,108.609588 C223.527076,108.670901 223.453057,108.696292 223.391743,108.666299 C223.352454,108.64708 223.32625,108.608527 223.322837,108.564922 L222.301143,95.5092527 C222.287288,95.3322104 222.226538,95.162051 222.125136,95.0162646 L216.953324,87.5806609 C216.894006,87.4953785 216.903705,87.3799683 216.976425,87.305782 C217.046023,87.2347801 217.159664,87.2325982 217.231937,87.3008762 Z M222.366539,79.1280465 C226.171065,79.1280465 229.560439,82.11077 231.441837,86.6210051 L227.168087,89.7704961 C226.083513,87.8896545 224.466212,86.6406524 222.812613,86.6406524 C221.491389,86.6406524 220.502958,87.4380137 219.818368,88.7179341 L215.602873,83.4330464 C216.990794,80.6520426 219.224968,79.1280465 222.366539,79.1280465 Z",
        panelName:"gaming.lightingNewversion.machineName.name1", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T750_fct.png",
        panelImageType:false
      }
    ];
    public lightingPanelImageT550AMD:any = [
      {
        value:1, 
        pathUrl:"M233.106042,84.5041186 C233.680583,86.5885283 234,88.8880151 234,91.3118657 C234,100.47794 230.871271,107.301553 225.353862,107.949546 L225.622243,98.8624168 C227.476486,97.7047368 228.532837,94.5902615 228.532837,90.9017538 C228.532837,90.472764 228.509628,90.0484035 228.465251,89.6314219 L233.106042,84.5041186 Z M215.05667,80.7772407 L219.122657,86.7104701 C218.851839,87.9745464 218.721333,89.4101675 218.721333,90.9017538 C218.721333,94.9019874 220.435566,98.2270626 222.728616,99.1131696 L223.294597,107.883567 C217.85249,106.804578 214,98.3874574 214,89.3886716 C214,86.0151759 214.346482,83.1181344 215.05667,80.7772407 Z M217.368423,82.1304257 L217.382449,82.1449495 L223.704031,89.5247155 L230.424823,85.1922642 C230.481292,85.1558623 230.556578,85.17213 230.59298,85.2285991 C230.605647,85.2482487 230.612384,85.2711321 230.612384,85.2945106 C230.612384,85.4391323 230.564121,85.5796179 230.475242,85.693706 L225.307835,92.3268243 C225.182181,92.4881195 225.108989,92.6840556 225.098121,92.8882295 L224.441225,105.229733 C224.428387,105.470923 224.328689,105.699317 224.16055,105.872716 L224.113753,105.920976 C224.038323,105.998766 223.914114,106.000679 223.836324,105.925249 C223.801423,105.891407 223.780329,105.845812 223.777132,105.797303 L222.876709,92.1375441 C222.866096,91.9765337 222.816677,91.8204829 222.732673,91.6827143 L217.099362,82.4440235 C217.040527,82.3475325 217.052673,82.2237484 217.129142,82.1405339 C217.192426,82.071667 217.299556,82.0671414 217.368423,82.1304257 Z M222.88856,73.9999999 C226.931489,73.9999999 230.525774,77.4153277 232.470406,82.551468 L227.374446,85.7743971 C226.301072,83.5723581 224.613953,82.0846428 222.886951,82.0846428 C221.607797,82.0846428 220.642873,82.9008111 219.965517,84.2188875 L215.82133,78.7654357 C217.271673,75.6869819 219.606126,73.9999999 222.88856,73.9999999 Z",
        panelName:"gaming.lightingNewversion.machineName.name1", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550AMD_wind.png",
        panelImageType:true
      },
      {
        value:2, 
        pathUrl:"M148.127413,46.4743163 C148.657301,46.3186332 149.213066,46.6219862 149.368749,47.1518741 C149.513312,47.6439129 149.262073,48.1582642 148.801187,48.3538811 L148.691191,48.3932102 L53.2818891,77.2781214 C52.7520012,77.4338045 52.1962361,77.1304515 52.040553,76.6005636 C51.8959902,76.1085248 52.1472288,75.5941735 52.6081156,75.3985566 L52.7181109,75.3592275 L148.127413,46.4743163 Z",
        panelName:"gaming.lightingNewversion.machineName.name2", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550AMD_wind.png",
        panelImageType:true
      },
      {
        value:4, 
        pathUrl:"M132.5,90 C135.895114,90 139.114595,91.00263 142.000978,92.797935 L142.000978,147.202065 C139.114595,148.99737 135.895114,150 132.5,150 C120.073593,150 110,136.568542 110,120 C110,103.431458 120.073593,90 132.5,90 Z",
        panelName:"gaming.lightingNewversion.machineName.name4", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550AMD_wind.png",
        panelImageType:true
      },
      {
        value:8, 
        pathUrl:"M50,117.5a21,26.5 0 1,0 42,0a21,26.5 0 1,0 -42,0",
        panelName:"gaming.lightingNewversion.machineName.name3", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550AMD_wind.png",
        panelImageType:true
      },
      {
        value:16, 
        pathUrl:"M124.998836,116.872032 L130.106615,120.195269 L128.435494,117.99219 C128.371627,117.90799 128.38161,117.789164 128.458631,117.716801 C128.541714,117.638744 128.661664,117.614108 128.768787,117.653101 L136.600227,120.50375 L141.999615,117.193269 L142.000172,141.497704 C140.587649,141.982172 139.046875,142.20582 137.3915,142.133283 L138.284978,129.878956 C140.02547,128.691117 141.316574,126.170567 141.840631,123.123379 C141.977593,122.326998 142.018905,121.533554 141.976983,120.764093 L139.543798,124.837238 C139.493873,124.920832 139.456425,125.01127 139.432639,125.105689 L136.629867,136.231133 C136.61018,136.309282 136.581117,136.384765 136.543312,136.455939 L136.385238,136.753537 C136.343908,136.831347 136.247326,136.86092 136.169516,136.81959 C136.126479,136.79673 136.096251,136.755454 136.087446,136.707524 L134.039216,125.557332 C134.010947,125.403442 133.946962,125.258332 133.852405,125.133671 L131.161615,121.586269 L131.117468,121.868567 C130.558813,125.686797 131.918877,129.081644 134.280702,130.21451 L135.480132,141.910623 C127.688604,140.360768 123.046607,131.013741 124.105143,121.59556 C124.297223,119.886564 124.594517,118.308663 124.998836,116.872032 Z M138.297617,107.062307 C139.591287,107.189049 140.831494,107.495801 142.000431,107.959775 L141.999615,115.658269 L140.740369,116.452164 C139.865739,114.944545 138.600787,113.899163 137.166107,113.689896 C134.937463,113.364819 133.236994,115.194132 132.160474,117.910944 L125.534021,115.220542 C127.677132,109.437405 131.881244,106.434218 138.297617,107.062307 Z",
        panelName:"gaming.lightingNewversion.machineName.name5", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550AMD_water.png",
        panelImageType:true
      },
      {
        value:32, 
        pathUrl:"M50,117.5a21,26.5 0 1,0 42,0a21,26.5 0 1,0 -42,0",
        panelName:"gaming.lightingNewversion.machineName.name6", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550AMD_water.png",
        panelImageType:true
      },
      {
        value:64, 
        pathUrl:"M212.5,131 C224.374122,131 234,146.670034 234,166 C234,185.329966 224.374122,201 212.5,201 C200.625878,201 191,185.329966 191,166 C191,146.670034 200.625878,131 212.5,131 Z M211.5,58 C223.926407,58 234,73.2223185 234,92 C234,110.777681 223.926407,126 211.5,126 C199.073593,126 189,110.777681 189,92 C189,73.2223185 199.073593,58 211.5,58 Z",
        panelName:"gaming.lightingNewversion.machineName.name11", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550AMD_wind.png",
        panelImageType:true
      },
      {
        value:128, 
        pathUrl:"M112,62 L112.916507,62.0042869 C126.299053,62.1296756 137,64.9899236 137,68.5 C137,72.0898509 125.807119,75 112,75 L111.083493,74.9957131 C97.7009472,74.8703244 87,72.0100764 87,68.5 C87,64.9101491 98.1928813,62 112,62 Z M142.080665,50.136803 L142.080665,63.9999596 L141.194164,63.9451685 C130.186845,63.2050435 122,60.4070271 122,57.0683813 C122,53.6407049 130.629298,50.782876 142.080665,50.136803 Z",
        panelName:"gaming.lightingNewversion.machineName.name12", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550AMD_wind.png",
        panelImageType:true
      },
      {
        value:256, 
        pathUrl:"M232.121374,88.5367111 C232.685746,90.4400604 233,92.5442901 233,94.7639961 C233,103.05261 229.998706,109.220475 224.706872,109.793098 L224.707531,102.580163 C227.105673,101.981862 228.5,98.7573527 228.5,94.8338999 C228.5,93.9660953 228.389205,93.1186768 228.188817,92.3180043 L232.121374,88.5367111 Z M214.838709,85.3526245 L218.973505,91.1502661 C218.732678,92.2725573 218.616375,93.5302248 218.616375,94.8338999 C218.616375,98.2863261 220.105972,101.197557 222.168814,102.254458 L222.703965,109.721642 C217.522984,108.707075 213.860337,101.127987 213.860337,93.0269813 C213.860337,90.029556 214.18123,87.4485945 214.838709,85.3526245 Z M217.231937,87.3008762 L223.358155,93.0885184 L230.578022,87.8474833 C230.733841,87.7343718 230.933635,87.7007494 231.117892,87.7566309 C231.222296,87.7882945 231.281264,87.8985993 231.2496,88.0030034 C231.241481,88.0297766 231.227767,88.0545198 231.209366,88.0755947 L224.847028,95.3625949 C224.703539,95.5269376 224.617732,95.7336968 224.60269,95.9513465 L223.769456,108.008013 C223.760558,108.136756 223.726826,108.26256 223.670119,108.378484 L223.557069,108.609588 C223.527076,108.670901 223.453057,108.696292 223.391743,108.666299 C223.352454,108.64708 223.32625,108.608527 223.322837,108.564922 L222.301143,95.5092527 C222.287288,95.3322104 222.226538,95.162051 222.125136,95.0162646 L216.953324,87.5806609 C216.894006,87.4953785 216.903705,87.3799683 216.976425,87.305782 C217.046023,87.2347801 217.159664,87.2325982 217.231937,87.3008762 Z M222.366539,79.1280465 C226.171065,79.1280465 229.560439,82.11077 231.441837,86.6210051 L227.168087,89.7704961 C226.083513,87.8896545 224.466212,86.6406524 222.812613,86.6406524 C221.491389,86.6406524 220.502958,87.4380137 219.818368,88.7179341 L215.602873,83.4330464 C216.990794,80.6520426 219.224968,79.1280465 222.366539,79.1280465 Z",
        panelName:"gaming.lightingNewversion.machineName.name1", 
        panelImage:"assets/images/gaming/lighting/lighting-ui-new/T550AMD_fct.png",
        panelImageType:false
      }
    ];
    public presetColorListData:any = [
        {"color":"FFB3B3","isChecked":false},
        {"color":"FFA788","isChecked":false},
        {"color":"FFFBB2","isChecked":false},
        {"color":"ADD97E","isChecked":false},
        {"color":"99FBFF","isChecked":false},
        {"color":"80C3EE","isChecked":false},
        {"color":"8189D8","isChecked":false},
        {"color":"A67AFF","isChecked":false},
        {"color":"DFC2FF","isChecked":false},
        {"color":"FFD8EB","isChecked":false},
        {"color":"FF0000","isChecked":false},
        {"color":"FF7B4C","isChecked":false},
        {"color":"FFE14C","isChecked":false},
        {"color":"7CE809","isChecked":false},
        {"color":"00F5FF","isChecked":false},
        {"color":"158DDD","isChecked":false},
        {"color":"3849F8","isChecked":false},
        {"color":"6211FF","isChecked":false},
        {"color":"C564CC","isChecked":false},
        {"color":"FF3D9C","isChecked":false},
        {"color":"660000","isChecked":false},
        {"color":"9C2900","isChecked":false},
        {"color":"666100","isChecked":false},
        {"color":"068000","isChecked":false},
        {"color":"009382","isChecked":false},
        {"color":"164B99","isChecked":false},
        {"color":"0112C1","isChecked":false},
        {"color":"4400C0","isChecked":false},
        {"color":"4B1B7F","isChecked":false},
        {"color":"7F1E4D","isChecked":false}
    ];
    public lightingEffectNoteData:any = {
      curSelected: 1,
      modeType: 1,
      dropOptions: [
          {
            header: 'gaming.lightingProfile.effect.option8.title',
            name: 'gaming.lightingProfile.effect.option8.title',
            id: 'lighting_effect_off',
            label: 'gaming.lightingProfile.effect.option8.title',
            metricitem: 'lighting_effect_off',
            value: 268435456
          },
          {
            header: 'gaming.lightingNewversion.lightingEffect.effectName1',
            name: 'gaming.lightingNewversion.lightingEffect.effectName1',
            id: 'lighting_effect_static',
            label: 'gaming.lightingNewversion.lightingEffect.effectName1',
            metricitem: 'lighting_effect_static',
            value: 1
          },
          {
            header: 'gaming.lightingProfile.effect.option3.title',
            name: 'gaming.lightingProfile.effect.option3.title',
            id: 'lighting_effect_breath',
            label: 'gaming.lightingProfile.effect.option3.title',
            metricitem: 'lighting_effect_breath',
            value: 4
          },
          {     
            header: 'gaming.lightingProfile.effect.option5.title',
            name: 'gaming.lightingProfile.effect.option5.title',
            id: 'lighting_effect_smooth',
            label: 'gaming.lightingProfile.effect.option5.title',
            metricitem: 'lighting_effect_smooth',
            value: 32
          },
          {
            header: 'gaming.lightingNewversion.lightingEffect.effectName5',
            name: 'gaming.lightingNewversion.lightingEffect.effectName5',
            id: 'lighting_effect_cool_blue',
            label: 'gaming.lightingNewversion.lightingEffect.effectName5',
            metricitem: 'lighting_effect_cool_blue',
            value: 1024,
            show_tool_tip: true
          },
          {
            header: 'gaming.lightingNewversion.lightingEffect.effectName6',
            name: 'gaming.lightingNewversion.lightingEffect.effectName6',
            id: 'lighting_effect_wave_right',
            label: 'gaming.lightingNewversion.lightingEffect.effectName6',
            metricitem: 'lighting_effect_wave_right',
            value: 4096,
            show_tool_tip: true
          },
          {
            header: 'gaming.lightingNewversion.lightingEffect.effectName7',
            name: 'gaming.lightingNewversion.lightingEffect.effectName7',
            id: 'lighting_effect_wave_left',
            label: 'gaming.lightingNewversion.lightingEffect.effectName7',
            metricitem: 'lighting_effect_wave_left',
            value: 8192,
            show_tool_tip: true
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