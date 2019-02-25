<script src="https://cdnjs.cloudflare.com/ajax/libs/url-search-params/1.1.0/url-search-params.js" integrity="sha256-vA5o1HRlFYggrn0yG+6bKGlnln9fWxi4S9cvzo6FlKw=" crossorigin="anonymous"></script>
<script src="%globals_asset_url:51310%"></script>
<script>
var routingInformation = new routingParameter(
    %begin_globals_get_pointA%{poiId: %globals_get_pointA%}%else_begin_globals_get_assetA%%begin_globals_get_assetA^as_asset:asset_metadata_POI%{poiId: %globals_get_assetA^as_asset:asset_metadata_POI%}%else_globals%{ lngLat: {lng: %globals_get_assetA^as_asset:asset_metadata_Longitude%, lat: %globals_get_assetA^as_asset:asset_metadata_Latitude%}, zLevel: %globals_get_assetA^as_asset:asset_metadata_Level^empty:0%}%end_globals%%else_begin_globals_get_lngA%{ lngLat: {lng: %globals_get_lngA%, lat: %globals_get_latA%}, zLevel: %globals_get_zA^empty:0%}%else_globals%null%end_globals%,
%begin_globals_get_pointB%{poiId: %globals_get_pointB%}%else_begin_globals_get_assetB%%begin_globals_get_assetB^as_asset:asset_metadata_POI%{ poiId: %globals_get_assetB^as_asset:asset_metadata_POI%}%else_globals%{ lngLat: {lng: %globals_get_assetB^as_asset:asset_metadata_Longitude%, lat: %globals_get_assetB^as_asset:asset_metadata_Latitude%}, zLevel: %globals_get_assetB^as_asset:asset_metadata_Level^empty:0%}%end_globals%%else_begin_globals_get_lngB%{ lngLat: {lng: %globals_get_lngB%, lat: %globals_get_latB%}, zLevel: %globals_get_zB^empty:0%}%else_globals%null%end_globals%
);
</script>
