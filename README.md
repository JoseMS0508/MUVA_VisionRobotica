# Blog para los ejercicios de la asignatura de visión robótica del MUVA

## Día 1

Tras conseguir instalar y ejecutar el Docker en mi portátil, empiezo las primeras pruebas para el procesamiento de imagen. Haciendo una detección del rojo y calculando un centroide, en función de la posición del centroide de la línea roja respecto al centro de la imagen, voy implementando un controlador reactivo que fija la velocidad angular y la velocidad máxima para ir recto. Con estas primeras pruebas consigo estar cerca de los cuatro minutos. Tenía bastante bajas las velocidades e ir probando y consigo llegar a los 3 minutos.  
El portátil va bastante lento y se me hace problemático llevar a cabo la práctica a pesar de tener un i7 de 11ª generación y 16 GB de RAM; se me queda colgado cada dos por tres y tengo que estar reiniciando el Docker y entrando y saliendo de la web incluso con pequeños cambios de código. Considero para el próximo día de trabajo usar el Mac mini M2 Pro que tengo para ver si ahí consigo que vaya mejor.

## Día 2

Instalo y ejecuto el ejercicio de Unibotics en el Mac mini y va sin problemas a pesar de los fallos de conexión puntuales del Docker y los reinicios que tengo que hacer del mismo. En este momento, paso a cambiar a un controlador PID. El script realiza lo siguiente:

- **Procesa la imagen:** Detecta la línea roja en la parte central de la imagen y obtiene su centroide.
- **Decide si es recta o curva:** Analiza la posición del centroide y la forma de la línea para determinar si el vehículo va en línea recta o está girando.
- **Ajusta la dirección:** Utiliza dos controladores PID (uno para rectas y otro para curvas) para corregir la trayectoria y mantener el coche en la línea.
- **Controla la velocidad:** Reduce la velocidad en curvas y acelera en rectas para un movimiento más estable.
- **Muestra la imagen procesada:** Superpone información en pantalla como la velocidad y el error de seguimiento.


https://github.com/user-attachments/assets/0516b1ac-48db-4153-8364-cf8fffc1aff4



Llego a conseguir un tiempo de vuelta cercano a 1 minuto y 10 segundos aproximadamente. Se observa claramente que oscila bastante en curvas, que por momentos casi se pierde, y que en zonas donde la curva no es pronunciada podría aumentarse la velocidad hasta llegar a los 14 km/h.
