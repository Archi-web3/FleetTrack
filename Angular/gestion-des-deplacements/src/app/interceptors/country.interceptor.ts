import { HttpInterceptorFn } from '@angular/common/http';

export const countryInterceptor: HttpInterceptorFn = (req, next) => {
    // Get selected country from localStorage
    const selectedCountry = localStorage.getItem('selectedCountry');
    console.log('[CountryInterceptor] Selected country:', selectedCountry);

    // Add X-Selected-Country header if country is selected
    if (selectedCountry) {
        const clonedReq = req.clone({
            setHeaders: {
                'X-Selected-Country': selectedCountry
            }
        });
        console.log('[CountryInterceptor] Added header X-Selected-Country:', selectedCountry);
        return next(clonedReq);
    }

    console.log('[CountryInterceptor] No country selected, no header added');
    return next(req);
};
