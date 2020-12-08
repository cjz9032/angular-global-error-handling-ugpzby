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
     cmsMock:{
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
    }
}