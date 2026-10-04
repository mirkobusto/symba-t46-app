# The deployment files and docs name the database variable SYMBA_DB_URL; the app used to read
# only DATABASE_URL, so the documented override did nothing.

from app import db as db_module


def test_symba_db_url_is_honoured(monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.setenv("SYMBA_DB_URL", "sqlite:////tmp/from-symba-var.db")
    assert db_module._database_url() == "sqlite:////tmp/from-symba-var.db"


def test_database_url_wins_when_both_are_set(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "sqlite:////tmp/from-database-url.db")
    monkeypatch.setenv("SYMBA_DB_URL", "sqlite:////tmp/from-symba-var.db")
    assert db_module._database_url() == "sqlite:////tmp/from-database-url.db"


def test_default_path_when_neither_is_set(monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.delenv("SYMBA_DB_URL", raising=False)
    assert db_module._database_url() == f"sqlite:///{db_module.DEFAULT_DB_PATH}"
