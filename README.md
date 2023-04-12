
[![MIT License][license-shield]][license-url]


<h1>SpotGeoApi</h1>

> Status : desenvolvendo

# Sobre o projeto

<p>
  O projeto SpotGeoAPI é uma API para um sistema de geografico, com usuarios, lugares geograficos e areas geograficas.
  </br> O projeto foi feito em node com typescript, usando PostgresSql com a extensão PostGis para trabalhar com os dados geograficos do projeto. Caso não conheça acesse <a href='https://postgis.net/'>POSTGIS</a>
</p>

# Apps

:heavy_check_mark: Users  (./users/)
:heavy_check_mark: Places (./places/)
:heavy_check_mark: Areas  (./areas/)

## ROTAS:

> USERS:

- POST (./users/login): <b>Authenticar usuario.</b>

> PLACES:

- GET (./places/): <b>Listar os lugares registrados.</b>

- GET (./places/:id): <b>Listar o lugar especificado por id.</b>

- GET (./places/:id1/distanceto/:id2): <b>Listar a distancia entre o lugar especificado por <i>id1</i>, com o lugar especificado por <i>id2</i>.</b>

- GET (./places/:idPlace/insideof/:idArea): <b>Listar se o lugar especificado por <i>idPlace</i>, esta dentro de uma area especificada por <i>idArea</i>.</b>

- POST (./places/): <b>Criar um lugar e persistir no banco.</b>

- PUT (./places/:id): <b>Editar o lugar especifica por <i>id</i>.</b>

- DELETE (./places/:id): <b>Deletar o lugar especificado por <i>id</i>.</b>

> AREAS

- GET (./areas/): <b>Listar todas as areas registradas.</b>

- GET (./areas/:id): <b>Listar a area especificada por <i>id</i>.</b>

- GET (./areas/:id/places): <b>Listar todos os lugares que estão contidos na area especificada por <i>id</i>.</b>

- POST (./areas/): <b>Criar uma area e persistir no banco.</b>

- PUT (./areas/:id) <b>Editar a area especificada por <i>id</i>.</b>

- DELETE (./areas/:id) <b>Deletar a area especificada por <i>id</i>.</b>

> SEARCH

- GET (./search?radius=&latitude=&longitude=): <b>Listar os lugares e areas que estão dentro do raio de <i>RADIUS</i> do centro, sendo o ponto definido com latitude de <i>LATITUDE</i>, e longitude de <i>LONGITUDE</i>.</b>

# Requisitos
- Tenha <a href='https://www.postgresql.org/'>postgres</a>, <a href='https://postgis.net/'>postgis</a>, e <a href='https://nodejs.org/en'>Node</a> 18.x.

# Iniciando aplicação

1. Clone o repositorio.
2. Instale as dependencias:
```
  npm install
```
3. Crie um arquivo <em>.env</em> na raiz da aplicação e popule, seguindo o <em>.env.example</em> .
4. Execute:
```
  npm run build
```
5. Rode o seguinte script para criar um banco de dados para aplicação:
```
  npm run createdb
```
6. Realiza a migração com:
```
  npm run migrate
```
7. A aplicação esta pronta para rodar:
  - caso queira rodar, execute:
  ```
    npm run start
  ```
  - caso queira executar os testes:
  ```
    npm run test:integration
  ```

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/mAv-b/SpotGeoAPI/blob/The_Master/LICENSE
