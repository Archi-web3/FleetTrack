import { HttpInterceptorFn } from '@angular/common/http';

export const countryInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip third-party external APIs
  if (req.url.includes('router.project-osrm.org')) {
    return next(req);
  }

  const selectedCountry = localStorage.getItem('selectedCountry');

  if (selectedCountry) {
    const cloned = req.clone({
      setHeaders: { 'X-Selected-Country': selectedCountry }
    });
    return next(cloned);
  }

  return next(req);
};
