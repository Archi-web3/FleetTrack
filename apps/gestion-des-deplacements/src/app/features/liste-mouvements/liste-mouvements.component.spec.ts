import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListeMouvementsComponent } from './liste-mouvements.component';

describe('ListeMouvementsComponent', () => {
  let component: ListeMouvementsComponent;
  let fixture: ComponentFixture<ListeMouvementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeMouvementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeMouvementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
