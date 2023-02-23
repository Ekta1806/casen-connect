@component('mail::message')
# Class Registration Invite

Dear {{ $invite->email }},

You have been invited to register for the class "{{ \App\Models\Classes::find($invite->class_id)->name }}".

Click the below link to register.

@component('mail::button', ['url' => $routeUrl])
Register Now!
@endcomponent

Thanks,<br />
{{ config('app.name') }}
@endcomponent
