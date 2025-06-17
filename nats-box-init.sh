STREAM="events"
SUBJECTS="events.>"
NATS_SERVER="nats"

if nats stream info "$STREAM" --server "$NATS_SERVER" > /dev/null 2>&1; then
  echo "Stream '$STREAM' already exists"
else
  nats stream add "$STREAM" --subjects "$SUBJECTS" --server "$NATS_SERVER" --defaults
fi