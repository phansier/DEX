# Options Trading Platform

This is the repository of the Options Trading Platform [MOSKVANT](https://moskvant.com).

[Github Repo](https://github.com/lacanoa/DEX)

## How to launch

1) Launch FuturesDailyScript.py to generate FuturesDaily.p
2) Launch this_script_gets_open_positions.py to generate borapik_indexed.p
3) Install Postgres. 
   Create user **project_user_jbt**
   In MacOs with Homebrew setup of Postgres:
   ```
   brew install postgres
   /usr/local/opt/postgres/bin/createuser -s project_user_jbt
   createdb myproject
   ```

## About

I set out to build an 'Options Trading Platform', but what is an 'options trading platform'? It is an interface that gives the user the ability to visualize and analyze information about options, and execute trades with these options. Thus, the platform has two main tasks: analysis, and execution.

### Analysis

Analysis for all options listed on the MOEX is available at [MOSKVANT](https://moskvant.com). The user can visualize information about options and about the market as a whole in a dynamic way.

### Execution

Execution refers to the mechanics behind allowing a user to exchange funds for options contracts, storing those contracts in the user account, and assigning the appropriate variation in margin resulting from this exchange. 

This is usually done by connecting through an exchange directly or via a broker. In order to allow execution for the users of this platform, the brokerage service [MAIA](https://maia.moskvant.com) was built.

Both the options trading platform, MOSKVANT, and the brokerage interface, MAIA, are still in development and testing stages. Soon, execution of contracts will be enabled by connecting both platforms.

## Author

* **Juan Bernardo Tobar** - [GitHub](https://github.com/moskvant)


