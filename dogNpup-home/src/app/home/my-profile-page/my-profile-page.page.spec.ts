import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyProfilePagePage } from './my-profile-page.page';

describe('MyProfilePagePage', () => {
  let component: MyProfilePagePage;
  let fixture: ComponentFixture<MyProfilePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProfilePagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfilePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
