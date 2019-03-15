#!/bin/bash

SRC_CONF="/etc/app/package/nginx.conf"
DEST_CONF="/etc/nginx/nginx.conf"

sed -e "s|backend1 ;|backend1 ${BACKEND_URL};|" \
    -e "s|backend2 ;|backend2 ${BACKEND_URL2};|" \
    -e "s|backend3 ;|backend3 ${BACKEND_URL3};|" \
    -e "s|location /api2 {|location ${PROXY_API2} {|" \
    -e "s|location /api3 {|location ${PROXY_API3} {|" \
    -e "s|rewrite ^/api2/(.*) /\$1 break;|rewrite ^${PROXY_API2}/(.*) /\$1 break;|" \
    -e "s|rewrite ^/api3/(.*) /\$1 break;|rewrite ^${PROXY_API3}/(.*) /\$1 break;|" \
    ${SRC_CONF} > ${DEST_CONF}

exec nginx -c ${DEST_CONF}
