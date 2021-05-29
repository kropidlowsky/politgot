create table political_parties
(
    id      serial  not null
        constraint political_party_pk
            primary key,
    name    varchar not null,
    abbr    varchar(15),
    picture bytea
);

create unique index political_party_id_uindex
    on political_parties (id);

create unique index political_party_name_uindex
    on political_parties (name);

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
    id        varchar(50) not null
        constraint political_parties_tweets_pk
            primary key,
    "user"    integer     not null
        constraint political_parties_tweets_political_parties_accounts_id_fk
            references political_parties_twitter_accounts,
    message   text        not null,
    date      timestamp   not null,
    tags      varchar(20)[],
    url_photo varchar,
    url_video varchar,
    url_tweet varchar,
    finder    tsvector
);

create unique index political_parties_tweets_id_uindex
    on political_parties_tweets (id);

create table poll_topics
(
    id    serial not null,
    title text   not null
);

create unique index parliament_polls_id_uindex
    on poll_topics (id);

create unique index poll_topics_title_uindex
    on poll_topics (title);

create table political_parties_wiki
(
    id              serial      not null
        constraint political_partis_wiki_pk
            primary key,
    url             varchar(60) not null,
    political_party integer     not null
        constraint political_partis_wiki_political_parties_id_fk
            references political_parties,
    summary         text
);

create unique index political_partis_wiki_id_uindex
    on political_parties_wiki (id);

create unique index political_partis_wiki_political_party_uindex
    on political_parties_wiki (political_party);

create unique index political_partis_wiki_url_uindex
    on political_parties_wiki (url);

create table api_user
(
    username_mdhex varchar,
    password_mdhex varchar,
    id             serial not null
);

create unique index api_user_id_uindex
    on api_user (id);

create table find_statistics
(
    id                      serial                not null,
    qty                     integer,
    word                    varchar,
    is_politic_search       boolean default false not null,
    is_politic_party_search boolean default false
);

create unique index find_statistics_id_uindex
    on find_statistics (id);

create unique index find_statistics_word_uindex
    on find_statistics (word);

create table gender
(
    id   serial      not null
        constraint gender_pk
            primary key,
    name varchar(10) not null
);

create table politicians
(
    id          serial      not null
        constraint politician_pk
            primary key,
    name        varchar(30) not null,
    surname     varchar(40) not null,
    profession  varchar(50),
    picture     bytea,
    education   varchar(30),
    birth_place varchar(30),
    votes       integer,
    birth_date  date,
    gender      integer
        constraint politicians_gender_id_fk
            references gender
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
    username   varchar(25) not null,
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
    id        varchar(50) not null
        constraint tweets_pk
            primary key,
    "user"    integer     not null
        constraint tweets_twitter_accounts_id_fk
            references politicians_twitter_accounts,
    message   text        not null,
    date      timestamp   not null,
    tags      varchar(20)[],
    url_photo varchar,
    url_video varchar,
    url_tweet varchar,
    finder    tsvector
);

create unique index tweets_id_uindex
    on politicians_tweets (id);

create table parliament_speeches
(
    id         serial  not null
        constraint parliament_speeches_pk
            primary key,
    politician integer not null
        constraint parliament_speeches_politicians_id_fk
            references politicians,
    speech     text    not null,
    points     integer not null,
    date       date,
    finder     tsvector
);

create unique index parliament_speeches_id_uindex
    on parliament_speeches (id);

create index speech_idx
    on parliament_speeches using gin (to_tsvector('simple'::regconfig, speech));

create table polls
(
    id               serial  not null
        constraint votes_pk
            primary key,
    parliament_topic integer not null
        constraint votes_parliament_polls_id_fk
            references poll_topics (id),
    politician       integer not null
        constraint votes_politicians_id_fk
            references politicians,
    vote             varchar(15),
    time             time    not null,
    date             date    not null
);

create unique index votes_id_uindex
    on polls (id);

create unique index polls_parliament_topic_date_politician_time_vote_uindex
    on polls (parliament_topic, date, politician, time, vote);

create table politicians_wiki
(
    id         serial      not null
        constraint politicians_wiki_pk
            primary key,
    url        varchar(60) not null,
    politician integer     not null
        constraint politicians_wiki_politicians_id_fk
            references politicians,
    summary    text
);

create unique index politicians_wiki_id_uindex
    on politicians_wiki (id);

create unique index politicians_wiki_politician_uindex
    on politicians_wiki (politician);

create unique index politicians_wiki_url_uindex
    on politicians_wiki (url);

create unique index gender_id_uindex
    on gender (id);

create unique index gender_name_uindex
    on gender (name);

create table speech_points
(
    id   serial not null
        constraint speech_points_pk
            primary key,
    name text   not null
);

create unique index speech_points_id_uindex
    on speech_points (id);

create unique index speech_points_name_uindex
    on speech_points (name);

