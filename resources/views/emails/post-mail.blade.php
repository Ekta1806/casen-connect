@component('mail::message')
# Post Mail

Dear {{ $details['dear_name'] }},

{{ $details['name'] }} {{ $details['body'] }}<br />
Post Content: {!! $details['desc'] !!}


@component('mail::button', ['url' => $routeUrl])
Check Post!
@endcomponent

Thanks,<br />
{{ config('app.name') }}
@endcomponent
