create table political_parties
(
    id   serial      not null
        constraint political_party_pk
            primary key,
    name varchar(30) not null,
    abbr varchar(8)
);
create unique index political_party_id_uindex
    on political_parties (id);

create unique index political_party_name_uindex
    on political_parties (name);

create table politicians
(
    id         serial      not null
        constraint politician_pk
            primary key,
    name       varchar(30) not null,
    surname    varchar(40) not null,
    birth_date date
);
create unique index politician_id_uindex
    on politicians (id);

create table political_party_affiliations
(
    id              serial  not null
        constraint political_party_affiliation_pk
            primary key,
    politican       integer not null
        constraint political_party_affiliation_politicians_id_fk
            references politicians,
    political_party integer not null
        constraint political_party_affiliation_political_parties_id_fk
            references political_parties,
    start_date      date,
    end_date        date
);

create unique index political_party_affiliation_id_uindex
    on political_party_affiliations (id);

create table politicians_twitter_accounts
(
    id         serial      not null
        constraint twitter_accounts_pk
            primary key,
    username   varchar(15) not null,
    politician integer
        constraint twitter_accounts_politicians_id_fk
            references politicians
);

create unique index twitter_accounts_id_uindex
    on politicians_twitter_accounts (id);

create unique index twitter_accounts_login_uindex
    on politicians_twitter_accounts (username);

create table politicians_tweets
(
    id      integer not null
        constraint tweets_pk
            primary key,
    "user"  integer not null
        constraint tweets_twitter_accounts_id_fk
            references politicians_twitter_accounts,
    message text    not null,
    date    date    not null,
    tags    varchar(20)[]
);

create unique index tweets_id_uindex
    on politicians_tweets (id);

create table political_parties_twitter_accounts
(
    id              serial      not null
        constraint political_parties_accounts_pk
            primary key,
    username        varchar(15) not null,
    political_party integer
        constraint political_parties_accounts_political_parties_id_fk
            references political_parties
);

create unique index political_parties_accounts_id_uindex
    on political_parties_twitter_accounts (id);

create unique index political_parties_accounts_username_uindex
    on political_parties_twitter_accounts (username);

create table political_parties_tweets
(
    id      integer not null
        constraint political_parties_tweets_pk
            primary key,
    "user"  integer not null
        constraint political_parties_tweets_political_parties_accounts_id_fk
            references political_parties_twitter_accounts,
    message integer not null,
    date    date    not null,
    tags    varchar(20)[]
);

create unique index political_parties_tweets_id_uindex
    on political_parties_tweets (id);

create table terms_of_office
(
    id         serial  not null
        constraint terms_of_office_pk
            primary key,
    start_year integer not null,
    end_year   integer
);

create unique index terms_of_office_id_uindex
    on terms_of_office (id);

create table parliament_speeches
(
    id             serial  not null
        constraint parliament_speeches_pk
            primary key,
    politician     integer not null
        constraint parliament_speeches_politicians_id_fk
            references politicians,
    term_of_office integer not null
        constraint parliament_speeches_terms_of_office_id_fk
            references terms_of_office,
    speech         text    not null
);

create unique index parliament_speeches_id_uindex
    on parliament_speeches (id);

create index speech_idx
    on parliament_speeches using gin (to_tsvector('simple'::regconfig, speech));

create table parliament_polls
(
    id             serial      not null,
    title          varchar(50) not null,
    date           date        not null,
    term_of_office integer     not null
        constraint parliament_polls_terms_of_office_id_fk
            references terms_of_office
);

create unique index parliament_polls_id_uindex
    on parliament_polls (id);

create table votes
(
    id              serial  not null
        constraint votes_pk
            primary key,
    parliament_poll integer not null
        constraint votes_parliament_polls_id_fk
            references parliament_polls (id),
    politician      integer not null
        constraint votes_politicians_id_fk
            references politicians,
    vote            integer
);

create unique index votes_id_uindex
    on votes (id);

create table politicians_wiki
(
    id         serial      not null
        constraint politicians_wiki_pk
            primary key,
    url        varchar(60) not null,
    politician integer     not null
        constraint politicians_wiki_politicians_id_fk
            references politicians
);

create unique index politicians_wiki_id_uindex
    on politicians_wiki (id);

create unique index politicians_wiki_politician_uindex
    on politicians_wiki (politician);

create unique index politicians_wiki_url_uindex
    on politicians_wiki (url);

create table political_parties_wiki
(
    id              serial      not null
        constraint political_partis_wiki_pk
            primary key,
    url             varchar(60) not null,
    political_party integer     not null
        constraint political_partis_wiki_political_parties_id_fk
            references political_parties
);

create unique index political_partis_wiki_id_uindex
    on political_parties_wiki (id);

create unique index political_partis_wiki_political_party_uindex
    on political_parties_wiki (political_party);

create unique index political_partis_wiki_url_uindex
    on political_parties_wiki (url);
