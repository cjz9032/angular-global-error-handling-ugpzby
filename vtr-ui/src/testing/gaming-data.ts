import { Pipe } from '@angular/core';
export const GAMING_DATA = {
	mockPipe(options: Pipe): Pipe {
		const metadata: Pipe = {
			name: options.name,
		};
		return Pipe(metadata)(
			class MockPipe {
				public transform(query: string, ...args: any[]): any {
					return query;
				}
			}
		);
	},
	cmsMock: {
		Results: [
			{
				Id: 'e64d43892d8448d088f3e6037e385122',
				Title: 'Header Image DCC',
				ShortTitle: '',
				Description: '',
				FeatureImage:
					'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/DCC_top_image.jpg?v=5cf8a0151ea84c4ca43e906339c3c3b2',
				Action: '',
				ActionType: null,
				ActionLink: null,
				BrandName: 'brandname',
				BrandImage: '',
				Priority: 'P1',
				Page: null,
				Template: 'header',
				Position: null,
				ExpirationDate: null,
				Filters: {
					'DeviceTag.Value': {
						key: 'System.DccGroup',
						operator: '==',
						value: 'true',
					},
				},
			},
			{
				Id: '8516ba14dba5412ca954c3ccfdcbff90',
				Title: 'Default Header Image',
				ShortTitle: '',
				Description: '',
				FeatureImage:
					'https://qa.csw.lenovo.com/-/media/Lenovo/Vantage/Features/Header-Image-Default.jpg?v=5d0bf7fd0065478c977ed284fecac45d',
				Action: '',
				ActionType: null,
				ActionLink: null,
				BrandName: '',
				BrandImage: '',
				Priority: 'P2',
				Page: null,
				Template: 'header',
				Position: null,
				ExpirationDate: null,
				Filters: null,
			},
		],
		Metadata: { Count: 2 },
	},
	buildPage(str: string) {
		return {
			Page: str,
		};
	},
	buildFeatureImage(str: string) {
		return {
			FeatureImage: str,
		};
	},
	lightingCapility: {
		LightPanelType: [1, 2, 4, 8],
		LedType_Complex: [268435456, 1, 2, 4, 8, 32, 256, 512],
		LedType_simple: [268435456, 1, 2, 3, 4],
		BrightAdjustLevel: 4,
		RGBfeature: 256,
		SpeedSetLevel: 4,
		SupportBrightnessSetList: [1, 2, 4, 8],
		SupportRGBSetList: [4, 8],
		SupportSpeedSetList: [4, 8],
		UnifySetList: [0],
		MemoryEffect: [268435456, 1, 2, 4, 1024],
		MemorySpeedLevel: 4,
		MemoryBrightLevel: 4,
		MemoryPanelType: [40961, 40962, 40963, 40964],
		MemoryUnifySetList: [0],
    },
    singleColorResponse: {
        LightPanelType: [1],
        LedType_Complex: [0],
        LedType_simple: [1, 2, 3, 4],
        BrightAdjustLevel: 0,
        RGBfeature: 1,
    },
    multipleColorResponse: {
        LightPanelType: [32, 64],
        LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128],
        LedType_simple: [0],
        BrightAdjustLevel: 4,
        RGBfeature: 255,
    },
    lightEffectComplexTypeMock: {
        Static: 1, // Same as On
        Flicker: 2,
        Breath: 4,
        Wave: 8,
        Music: 16,
        Smooth: 32, ///change spectrum to smooth
        CPU_thermal: 64,
        CPU_frequency: 128,
        Response: 256,
        Ripple: 512,
        Off: 268435456, ///same Off
    },
    panelImageData: [
        { panelType: 1, colorRGB: 1, panelImage: 'C530@2x.png' },
        { panelType: 4, colorRGB: 1, panelImage: 'T730Front@2x.png' },
    ]
};
