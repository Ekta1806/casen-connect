@component('mail::message')
# ClassPost tag

Dear {{ $details['dear_name'] }},

{{ $details['name'] }} {{ $details['body'] }}<br />
Content: {!! $details['comment'] !!}


@component('mail::button', ['url' => $routeUrl])
Check Post!
@endcomponent

Thanks,<br />
{{ config('app.name') }}
@endcomponent
