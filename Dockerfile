FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

ADD default.conf /etc/nginx/conf.d/
#RUN rm ${conf_dir}/conf.d/default.conf

COPY dist /usr/share/nginx/html