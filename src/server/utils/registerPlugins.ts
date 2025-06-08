import fastifyStatic from '@fastify/static';
import { FastifyInstance } from 'fastify';
import path from 'path';
import { getRootDir } from './paths';
import fastifyView from '@fastify/view';
import ejs from 'ejs';

export const registerPlugins = async ( fastify: FastifyInstance ) => {
  const rootDir = getRootDir();    
  
  // SERVE VIEWS
  await fastify.register(fastifyView, {
    engine: { ejs: ejs },
    root: path.join(rootDir, 'dist', 'client'),
    // layout: 'partials/layouts/layout.ejs',
    options: { cache: false }
  } );
  
  // SERVE STATIC FILES
  await fastify.register(fastifyStatic, {
    root: path.join(rootDir, 'dist', 'client'),
  });

};
