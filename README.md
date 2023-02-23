## CasenConnect

### Steps for installing this project on your local machine

Run the below commands one by one in your terminal or cmd.

```
git clone git@github.com:github.com/casen-connect.git
cd casen-connect
git checkout develop
composer install
cp .env.example .env
// Update your database credentials in the .env file
// Update mailtrap credentials in the .env file
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
npm install && npm run dev
php artisan serve
```

The above steps are same during installing in live site.
Except in live site, you will be checking out to `master` branch instead of `develop` branch.
