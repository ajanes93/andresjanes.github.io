#!/bin/bash
npm ci
npm run dev -- --host --port=$APP_HTTP_PORT
