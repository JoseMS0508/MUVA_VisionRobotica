# MUVA: VISIÓN ROBÓTICA. PRÁCTICA 1

## Día 1

Tras conseguir instalar y ejecutar el Docker en mi portátil, empiezo las primeras pruebas para el procesamiento de imagen. Haciendo una detección del rojo y calculando un centroide, en función de la posición del centroide de la línea roja respecto al centro de la imagen, voy implementando un controlador reactivo que fija la velocidad angular y la velocidad máxima para ir recto. Con estas primeras pruebas consigo estar cerca de los cuatro minutos. Tenía bastante bajas las velocidades e ir probando y consigo llegar a los 3 minutos.  
El portátil va bastante lento y se me hace problemático llevar a cabo la práctica a pesar de tener un i7 de 11ª generación y 16 GB de RAM; se me queda colgado cada dos por tres y tengo que estar reiniciando el Docker y entrando y saliendo de la web incluso con pequeños cambios de código. Considero para el próximo día de trabajo usar el Mac mini M2 Pro que tengo para ver si ahí consigo que vaya mejor.

## Día 2

Instalo y ejecuto el ejercicio de Unibotics en el Mac mini y va sin problemas a pesar de los fallos de conexión puntuales del Docker y los reinicios que tengo que hacer del mismo. En este momento, paso a cambiar a un controlador PID. El script realiza lo siguiente:

- **Procesa la imagen:** Detecta la línea roja en la parte central de la imagen y obtiene su centroide.
- **Decide si es recta o curva:** Analiza la posición del centroide y la forma de la línea para determinar si el vehículo va en línea recta o está girando.
- **Ajusta la dirección:** Utiliza dos controladores PID (uno para rectas y otro para curvas) para corregir la trayectoria y mantener el coche en la línea.
- **Controla la velocidad:** Reduce la velocidad en curvas y acelera en rectas para un movimiento más estable.
- **Muestra la imagen procesada:** Superpone información en pantalla como la velocidad y el error de seguimiento entre otros.




https://github.com/user-attachments/assets/726b75f5-f423-4ac5-ad14-fff6adc08662



Llego a conseguir un tiempo de vuelta cercano a 1 minuto y 10 segundos aproximadamente. Se observa claramente que oscila bastante en curvas, que por momentos casi se pierde, y que en zonas donde la curva no es pronunciada podría aumentarse la velocidad hasta llegar a los 14 km/h.


## Día 3

Empiezo a implementar el script que tenia en ackerman pero veo que no funciona y que hace cosas que estan bastante mal por lo que cambio de estrategia e implemento lo siguiente:

1. Captura y Preprocesamiento de la Imagen

Obtengo imágenes desde la cámara del robot, una vez adquirida la imagen, se recorta para enfocarse en la región de interés, limitando el área de análisis a la parte más logica de vision de la imagen, es decir, elimino la franja inferior y superior. Luego paso la imagen a HSV, ya que la detección de color en HSV es más robusta. Aplico filtros para detectar el color rojo mediante umbrales en HSV usando dos rangos para capturar tonos de rojo que pueden encontrarse en diferentes regiones del espectro HSV.

Para mejorar la segmentación, aplico operaciones morfológicas (apertura y cierre) para eliminar ruido y cerrar pequeños huecos en caso de que hubiese por cualquier razon.


2. Extracción de Características de la Línea

Una vez generada la máscara binaria, extraigo contornos y selecciono el de mayor área como la línea principal a seguir con el findcontours. 
Calculo el centroide de la línea para obtener la posición del robot respecto a la línea.
Selecciono puntos en los bordes de línea para estimar la curvatura, y los uno para intentar asi ver si puedo adivinar si estoy en curva o no en funcion de sus angulos de union.

![image](https://github.com/user-attachments/assets/8e82fe6e-88b7-445c-8f09-a0943d4a20d6)

Como se ve en la imagen se estan formando angulos entre los dos extremos de la linea por lo que la media de los angulos, esta totalmente oscilando y pasando de curva a recta sin mucho sentido, como se ve en el video. Haciendo a su vez que el coche oscile totalmente.

3. Control del Robot con PID Adaptativo

Calculo el error de seguimiento como la distancia del centroide de la línea al centro de la imagen, y el controlador PID varia en funcion de si esta en curvas y en rectas, es decir, el PID varia dinámicamente en función de la curvatura de la línea con este codigo:

kp = KP_BASE * (1.0 + 0.8 * curvatura)
ki = KI_BASE * (1.0 - 0.6 * curvatura)
kd = KD_BASE * (1.0 + 1.2 * curvatura)

- Kp (Proporcional) aumenta en curvas:
Como el Kp influye en qué tan rápido el coche responde al error, en curvas, un Kp más alto mejora la capacidad de girar rápidamente sin desviarse demasiado, por tanto lo multiplico por (1.0 + 0.8 × curvatura), para que aumente hasta un 80% en curvas pronunciadas.

- Ki (Integral) disminuye en curvas:
El componente integral acumula error con el tiempo, asi que en curvas, puede generar inestabilidad si lo mantengo alto, ya que puede provocar un sobreajuste y oscilaciones, entonces la reduzco en 60% en curvas pronunciadas con (1.0 − 0.6 × curvatura).

- Kd (Derivativo) aumenta en curvas:
El término derivativo ayuda a amortiguar cambios bruscos, asi que en curvas, que el error cambia rápidamente, necesitaré un Kd más alto para evitar giros agresivos. Por lo que se aumenta en 120% en curvas pronunciadas con (1.0 + 1.2 × curvatura).

El resultado de este código es el siguiente en curvas:



https://github.com/user-attachments/assets/c3a9cae4-42ee-463e-a9ff-415e6e06fa0f




Y el siguiente en rectas:


https://github.com/user-attachments/assets/24ba596b-32be-4f07-974e-6b2ac49821b0


Por lo que vemos que oscila mucho, y probablemente sea por el tema de la detección de la curva porque cuando esta mas con la linea en la zona lateral de la pantalla, los puntos y las líneas que lo unen parecen ser más rectas.






