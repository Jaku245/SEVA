#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <string.h>

#define MAXLINESIZE 100
#define SERV_PORT 5555

int main(int argc, char *argv)
{

    int connectedsd;
    char sendBuffer[MAXLINESIZE + 1];
    char recvBuffer[MAXLINESIZE + 1];

    struct sockaddr_in servaddr;
    int noBytesRead = 0;

    if (argc != 2)
    {
        fprintf(stderr, "Usage : %s IP- address", argc[0]);
        exit(-1);
    }

    if ((connectedsd = socket(AF_INET, SOCK_STREAM, 0)) < 0)
    {
        fprintf(stderr, "Cannot create socket");
        exit(-1);
    }

    bzero(&servaddr, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(SERV_PORT);

    if (inet_pton(PF_INET, argv[1], &serveraddr.sin_addr) <= 0)
    {
        fprintf(stderr, "Error in Inet pton");
        exit(-1);
    }

    if (connect(connectsd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0)
    {
        fprintf(stderr, "Error in connect");
        exit(-1);
    }

    for ( : get(sendBuffer) != NULL;)
    {
        write(connectedsd, sendBuffer, strlen(sendBuffer) + 1);
        if (noBytesRead = read(connectedsd, recvBuffer, sizeof(recvBuffer)) < 0)
            exit(0);
        fprintf(stdout, "%s\n", recvBuffer);
    }

    return 0;
}
