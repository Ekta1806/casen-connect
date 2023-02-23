@component('mail::message')
# Flagged Word

Dear {{ $details['dear_name'] }},

{{ $details['name'] }} {{ $details['body'] }}<br />
Flagged Word Content: {!! $details['content'] !!}

@component('mail::button', ['url' => $routeUrl])
Check Flagged Word!
@endcomponent

Thanks,<br />
{{ config('app.name') }}
@endcomponent