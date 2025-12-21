// Type declarations for leaflet-routing-machine
// This file provides minimal type definitions to avoid TypeScript errors

declare module 'leaflet' {
    namespace Routing {
        function control(options: any): any;
        function osrmv1(options: any): any;
        interface Control {
            addTo(map: any): any;
        }
    }
}
