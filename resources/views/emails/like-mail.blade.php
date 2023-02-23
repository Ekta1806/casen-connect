@component('mail::message')
# Post Get Like

@if($type === "teacher")
    Dear  {{ $post->teacher->full_name }} ,
@elseif($type === "student")
    Dear  {{ $post->user->full_name }} ,
@endif

Your Post Has been Liked by {{ $user->full_name }}.

@component('mail::button', ['url' => $routeUrl])
Check Post!
@endcomponent

Thanks,<br />
{{ config('app.name') }}
@endcomponent
