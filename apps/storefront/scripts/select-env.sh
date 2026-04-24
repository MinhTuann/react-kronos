#!/bin/sh

echo ""
echo "┌────────────────────────────┐"
echo "│   Select an environment    │"
echo "├────────────────────────────┤"
echo "│  1) dev                    │"
echo "│  2) uat                    │"
echo "│  3) prod                   │"
echo "└────────────────────────────┘"
printf "Enter choice [1-3]: "
read choice

case $choice in
  1) ENV="dev" ;;
  2) ENV="uat" ;;
  3) ENV="prod" ;;
  *) echo "Invalid choice. Defaulting to dev."; ENV="dev" ;;
esac

echo "▶ Running with NODE_ENV=$ENV"
echo ""

NODE_ENV=$ENV exec "$@" --mode "$ENV"
