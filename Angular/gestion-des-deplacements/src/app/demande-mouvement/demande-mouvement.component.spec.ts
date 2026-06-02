import { ComponentFixture, TestBed } from '@angular/core/testing';
// Importez la classe du composant principal
import { DemandeMouvementComponent } from './demande-mouvement.component'; // <<< CORRECTION ICI

describe('DemandeMouvementComponent', () => { // <<< CORRECTION DU NOM DE LA CLASSE ICI
  let component: DemandeMouvementComponent;
  let fixture: ComponentFixture<DemandeMouvementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeMouvementComponent] // <<< CORRECTION ICI
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeMouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
