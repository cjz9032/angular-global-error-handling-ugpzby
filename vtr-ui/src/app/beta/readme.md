# This is a tutorial to help you how to do beta-module

I have already done the beta-module framework, just need to add the beta feature to it and it will work.

I have already done a beta feature for the password manager, you can also use it as an example.

## Add the beta feature need these step

1.you need new a folder to put your beta feature file

2.use `ng g module feature-name --routing` command to create your feature module and routing module in your folder

3.create or copy your feature component to this folder, if your component just use exist the basic ui/widget component , you don't need create or copy them , else you should create your new ui/widget in your folder like example.

4.Coding your-module and your-routing module according to your feature content.

    1> declarations your component

    2> imports module what your component used

    3> write schemas

    4> coding router in your-routing module 

5.If your feature is big to need lazy-load, you should use lazy-load in beta-module-routing.module.ts, if not, you just need import your module in beta-module.module.ts

6.add subitems in config.service betaItem to add entry in program

