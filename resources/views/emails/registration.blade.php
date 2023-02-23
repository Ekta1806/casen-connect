@component('mail::message')
# Student Accept Invitation

Dear {{ $details['dear_name'] }},

 {{ "Student"." ".$details['name'] }} {{ $details['body'] }}<br />
Class Name: {!! $details['class'] !!}

Thanks,<br />
{{ config('app.name') }}
@endcomponent