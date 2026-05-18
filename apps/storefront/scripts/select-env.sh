#!/bin/sh

normalize_env() {
  case "$1" in
    1 | dev) printf '%s\n' "dev" ;;
    2 | uat) printf '%s\n' "uat" ;;
    3 | prod | production) printf '%s\n' "prod" ;;
    *) return 1 ;;
  esac
}

select_env() {
  if [ -n "$KRONOS_ENV" ] && normalize_env "$KRONOS_ENV"; then
    return
  fi

  if [ -n "$NODE_ENV" ] && normalize_env "$NODE_ENV"; then
    return
  fi

  if [ -t 0 ]; then
    echo "" >&2
    echo "+----------------------------+" >&2
    echo "|   Select an environment    |" >&2
    echo "+----------------------------+" >&2
    echo "|  1) dev                    |" >&2
    echo "|  2) uat                    |" >&2
    echo "|  3) prod                   |" >&2
    echo "+----------------------------+" >&2
    printf "Enter choice [1-3]: " >&2
    read choice

    if normalize_env "$choice"; then
      return
    fi

    echo "Invalid choice. Defaulting to dev." >&2
  fi

  printf '%s\n' "dev"
}

ENV=$(select_env)

echo "Running with NODE_ENV=$ENV"
echo ""

NODE_ENV=$ENV exec "$@" --mode "$ENV"
