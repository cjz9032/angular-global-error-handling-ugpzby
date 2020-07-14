# Snapshot testing tutorial

Snapshot tests is a very useful tool whenever you want to make sure your UI does not change unexpectedly. Here's a short tutorial on how to start a snapshot test for a UI component.

### 1. Create the component test file 

---

Create a file with the suffix `.test.ts` in the component folder that you want to do snapshot.

An example directory structure looks like this.

<img src="C:\Users\qianwh1\AppData\Roaming\Typora\typora-user-images\image-20200708092441780.png" alt="image-20200708092441780" style="zoom:;" />



### 2. Create a `describe` block

---

Create a `describe ` block in your `.test.ts` file, for example:

``` typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MenuMainComponent } from "./menu-main.component";

describe("MenuMainComponent", () => {
	let fixture: ComponentFixture<MenuMainComponent>;
    
    beforeEach((() => {
        // configure a testing module using the TestBed class
        TestBed.configureTestingModule({
          declarations: [
            MenuMainComponent
          ],
        }).compileComponents();
         // create component and test fixture
        fixture = TestBed.createComponent(MenuMainComponent);
    }));

    it("MenuMainComponent snapshot", () => {
        // match the newly formed snapshot with the last generated snapshot file
        expect(fixture).toMatchSnapshot(); 
    });
})
```



### 3. Mock the dependencies

---

If there's any dependencies in your component, you should provide mocks via`TestBed.configureTestingModule`  in order to make the test passes

``` typescript
	...
    ...
// import component dependency services
import { CommonService } from "src/app/services/common/common.service";
	...
	... 

class CommonMockService {
    // The data and function your mock
} 
    
describe("MenuMainComponent", () => {
	let fixture: ComponentFixture<MenuMainComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
            ...
            ...
			imports: [AppModule],
            // use a mock class to replace the dependency in your component
			providers: [
				{
					provide: CommonService,
					useClass: CommonMockService,
				}
            ]
            ...
            ...
    	}).compileComponents();
         fixture = TestBed.createComponent(MenuMainComponent);
     });  

    it("MenuMainComponent snapshot", () => {
        expect(fixture).toMatchSnapshot();
    });
})
```



### 4. Provide the @input values

---

You should also provide those @input attributes if any as it may affect the generated snapshot

``` typescript
describe("MenuMainComponent", () => {
	let fixture: ComponentFixture<MenuMainComponent>;
    let component: MenuMainComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			...
            ...
    	}).compileComponents();
        
        // create the component instance
        fixture = TestBed.createComponent(MenuMainComponent);
        // get test component from the fixture
        component = fixture.componentInstance;
        // provider the @input data and detect changes
    	component.loadMenuItem = {
            hideMenus: false,
            firstRunDate: {
                length: 8
            }
        }
        fixture.detectChanges();
    });  

    it("MenuMainComponent snapshot", () => {
        expect(fixture).toMatchSnapshot();
    });
})
```



### 5. Run

---

``` shell
npm run snapshot-test
```

Once the snapshot test is complete successfully, a `_snapshots_` folder is created at the same level of `.test.ts` files. An example directory structure now looks like this.

<img src="C:\Users\qianwh1\AppData\Roaming\Typora\typora-user-images\image-20200708134310791.png" alt="image-20200708134310791" style="zoom:;" />



### 6. A possible example of the generated snapshot

---

``` typescript
exports[`MenuMainComponent snapshot`] = `
<vtr-menu-main
  adPolicyService={[Function AdPolicyMockService]}
  backlightService={[Function BacklightMockService]}
  cardService={[Function CardMockService]}
  commonService={[Function CommonMockService]}
  configService={[Function ConfigMockService]}
  constantDevice={[Function String]}
  constantDeviceSettings={[Function String]}
  dashboardService={[Function DashboardMockService]}
  deviceService={[Function DeviceMockService]}
  dropDowns={[Function QueryList]}
  hideDropDown="false"
  isDashboard={[Function Boolean]}
  isLoggingOut="false"
  items={[Function Array]}
  keyboardService={[Function InputAccessoriesMockService]}
  languageService={[Function LanguageMockService]}
  loadMenuItem={[Function Object]}
  logger={[Function LoggerMockService]}
  machineFamilyName={[Function String]}
  menuTarget={[Function ElementRef]}
  modalService={[Function ModalMockService]}
  router={[Function Router]}
  searchTips=""
  showMenu="false"
  showSearchBox="false"
  showSearchMenu="false"
  subscription="undefined"
  topRowFunctionsIdeapadService={[Function TopRowFunctionsIdeapadMockService]}
  translate={[Function TranslateMockService]}
  userService={[Function UserMockService]}
  vantageShellService={[Function VantageShellMockService]}
>
  <div
    class="vtr-menu-main"
  >
    <nav
      class="navbar navbar-expand-xl pr-0"
    >
      <div
        class="navbar-brand p-0"
      >
        <svg
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>
               .a { fill: #e1140a; } .b { fill: #fff; } .c { fill: #590804; } 
            </style>
          </defs>
          <rect
            class="a"
...
...
...
```



### 7. My code is changed, what should I do?

---

1. **Nothing, if...**

   Your change is all about the underlying logic, where no template/DOM would be affected.

   In this case, the snapshot you've captured last time is a reference of right or wrong if your change is good or not.

2. **Run `npm run snapshot-test -- -u`, if...:**

   It's a design change, whether or not it's about template/DOM or styles.



### For further information

---

Please go to [Jest official website](https://jestjs.io/docs/en/snapshot-testing)

