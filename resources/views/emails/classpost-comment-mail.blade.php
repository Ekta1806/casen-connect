@component('mail::message')
# ClassPost Comment

Dear {{ $details['name'] }},

{{ $details['body'] }}<br />
Comment Content: {!! $details['comment'] !!}


@component('mail::button', ['url' => $routeUrl])
Check Post!
@endcomponent

Thanks,<br />
{{ config('app.name') }}
@endcomponent
