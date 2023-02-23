@component('mail::message')
# Approve/Reject Post

Dear {{ $details['teacher_name'] }},

{{ $details['name'] }} {{ $details['body'] }}<br />
Post Content : {!! $details['desc'] !!}

@component('mail::button', ['url' => $routeUrl])
Check Post!
@endcomponent

Thanks,<br />
{{ config('app.name') }}
@endcomponent