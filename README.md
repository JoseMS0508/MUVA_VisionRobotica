Blog para los ejercicios de la asignatura de visión robótica del MUVA.

DIA 1
Tras conseguir instalar y ejecutar el docker en mi portatil, empiezo las primeras pruebas para el procesamiento de imagen. Haciendo una deteccion del rojo y calculando un centroide, en funcion de la posicion del centroide de la linea roja respecto al centro de la imagen, voy implementando un controlador reactivo que fija la velocidad angular y la velocidad maxima para ir recto. Con estas primeras pruebas consigo estar cerca de los cuatro minutos. Tenia bastante bajas las velocidades e ir probando y consigo llegar a los 3 minutos. El portatil va bastante lento y se me hace problematico llevar a cabo la practica a pesar de tener un i7 11gen y 16gb de ram, se me queda colgado cada dos por tres y tengo que estar reiniciando el docker y entrando y saliendo de la web incluso con pequeños cambios de codigo. Considero para el próximo dia de trabajo usar el mac mini m2 pro que tengo para ver si ahi consigo que vaya mejor.


DIA 2
Instalo y ejecuto el ejercicio de unibotics en el mac mini y va sin problemas a pesar de los fallos de conexion puntuales del docker y los reinicios que tengo que hacer del mismo. En este momento paso a cambiar a un controlador PID. Donde el script hace lo siguiente:
- Procesa la imagen: Detecta la línea roja en la parte central de la imagen y obtiene su centroide.
- Decide si es recta o curva: Analizo la posición del centroide y la forma de la línea para saber si el vehículo va en línea recta o está girando.
- Ajusta la dirección: Uso dos controladores PID (uno para rectas y otro para curvas) para corregir la trayectoria y mantener el coche en la línea.
- Controla la velocidad: Reduzco la velocidad en curvas y acelero en rectas para un movimiento más estable.
- Muestra la imagen procesada: Superpone información en pantalla como la velocidad y el error de seguimiento.

Llego a conseguir un tiempo de vuelta cercano a 1min y 10segs aproximadamente.

https://github.com/user-attachments/assets/0516b1ac-48db-4153-8364-cf8fffc1aff4

