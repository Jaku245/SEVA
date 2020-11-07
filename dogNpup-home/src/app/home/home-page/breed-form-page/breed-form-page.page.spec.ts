import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BreedFormPagePage } from './breed-form-page.page';

describe('BreedFormPagePage', () => {
  let component: BreedFormPagePage;
  let fixture: ComponentFixture<BreedFormPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreedFormPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BreedFormPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
