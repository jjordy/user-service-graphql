# Environment Variables
```
PORT=4000 - required
NODE_ENV=development - required
DEBUG=user-service:* 
DATABASE_URL=postgres://127.0.0.1:5432/postgres - required
LOG_LOCATION=C:\ - required
LOG_NAME=testlogs.log 
JWT_SECRET=devSecret - required
GRAPHIQL=true
```

# Docker Commands

To Create Docker volume

```
docker volume create pgdata
```

To Run development DB

```
docker run
-d
-e POSTGRES_PASSWORD=test
-e POSTGRES_USER=app
-e PGDATA=/var/lib/postgresql/data/pgdata
-p 127.0.0.1:5432:5432
--mount source=pgdata,target=/var/lib/postgresql/data/pgdata
postgres
```

down vote
accepted
To run pg_dump you can use docker exec command:

To backup:

```
docker exec -u <your_postgres_user> <postgres_container_name> pg_dump -Fc <database_name_here> > db.dump
```

To drop db (Don't do it on production, for test purpose only!!!):

```
docker exec -u <your_postgres_user> <postgres_container_name> psql -c 'DROP DATABASE <your_db_name>'
```

To restore:

```
docker exec -i -u <your_postgres_user> <postgres_container_name> pg_restore -C -d postgres < db.dump
```

Also you can use docker-compose analog of exec. In that case you can use short services name (postgres) instead of full container name (composeproject_postgres).


# Graphql

## Mutations

```
mutation {
  updateUser(userId: "e8bac95b-fcc8-4ebd-8261-a28de2eff1ed", input:{
    FirstName:"Jordan"
    LastName:"Addison"
    PhoneNumber:"2285470060"
  }) {
    id,
    Email
    FirstName
  }
}
```

```
mutation {
  createUser(input:{
    FirstName:"Jordan"
    LastName:"Addison"
    PhoneNumber:"2285470060"
    Email: "jordanrileyaddison@gmail.com"
    Password: "$tudenT1"
    ConfirmPassword: "$tudenT1"
  }) {
    id,
    Email
    FirstName
  }
}
```