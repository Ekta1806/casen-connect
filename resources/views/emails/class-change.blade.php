@component('mail::message')
# New Class Assign

Dear {{ $details['dear_name'] }},

 {{ $details['name'] }} {{ $details['body'] }}<br />

Thanks,<br />
{{ config('app.name') }}
@endcomponent