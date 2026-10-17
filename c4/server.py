"""Loopback API launcher; selector loop avoids the Windows IOCP accept failure."""
import argparse
import asyncio
import os

import uvicorn


def local_loop():
    return asyncio.SelectorEventLoop()


def main():
    parser = argparse.ArgumentParser(description='C4 API local de evidencia (solo lectura).')
    parser.add_argument('--port',type=int,default=8000)
    parser.add_argument('--store',default=None,help='Directorio de checkpoints CLI')
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('El puerto debe estar entre 1 y 65535.')
    if args.store is not None:
        os.environ['C4_STORE'] = args.store
    uvicorn.run('c4.api:app',host='127.0.0.1',port=args.port,loop='c4.server:local_loop')


if __name__ == '__main__':
    main()
